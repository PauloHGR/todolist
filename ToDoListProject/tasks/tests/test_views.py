from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth.models import User
from tasks.models import Task

class TaskViewTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='test')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

        self.task1 = Task.objects.create(title="Bugfix load page", completed=False)
        self.task2 = Task.objects.create(title="Write Documentation", completed=True)
        self.task3 = Task.objects.create(title="Prepare presentation", completed=True)

    def test_get_all_tasks(self):
        response = self.client.get('/api/tasks/')
        self.assertEqual(response.status_code, 200)
        self.assertIn('results', response.data)
        self.assertEqual(len(response.data['results']), 2)

    def test_pagination_tasks(self):
        response_page1 = self.client.get('/api/tasks/?page=1')
        response_page2 = self.client.get('/api/tasks/?page=2')

        self.assertEqual(len(response_page1.data['results']), 2)
        self.assertEqual(len(response_page2.data['results']), 1)

    def test_filter_by_title(self):
        response = self.client.get('/api/tasks/?search=bugfix')
        titles = [t['title'].lower() for t in response.data['results']]
        self.assertTrue(any("bugfix" in title for title in titles))

    def test_filter_by_completion_true(self):
        response = self.client.get('/api/tasks/?completed=true')
        for task in response.data['results']:
            self.assertTrue(task['completed'])

    def test_filter_by_completion_false(self):
        response = self.client.get('/api/tasks/?completed=false')
        for task in response.data['results']:
            self.assertFalse(task['completed'])

    def test_create_task_successfully(self):
        data = {'title': 'New Task', 'completed': False}
        response = self.client.post('/api/tasks/', data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['title'], 'New Task')

    def test_create_task_invalid(self):
        response = self.client.post('/api/tasks/', {})
        self.assertEqual(response.status_code, 400)
        self.assertIn('title', response.data)

    def test_get_task_detail(self):
        response = self.client.get(f'/api/tasks/{self.task1.id}/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['title'], self.task1.title)

    def test_update_task(self):
        data = {'title': 'Updated', 'completed': True}
        response = self.client.put(f'/api/tasks/{self.task1.id}/', data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['title'], 'Updated')
        self.assertTrue(response.data['completed'])

    def test_delete_task(self):
        response = self.client.delete(f'/api/tasks/{self.task1.id}/')
        self.assertEqual(response.status_code, 204)
        self.assertFalse(Task.objects.filter(id=self.task1.id).exists())

    def test_get_nonexistent_task(self):
        response = self.client.get('/api/tasks/1234/')
        self.assertEqual(response.status_code, 404)

    def test_register_user_success(self):
        self.client.logout()
        data = {'username': 'newuser', 'password': '123456'}
        response = self.client.post('/api/register/', data)
        self.assertEqual(response.status_code, 201)
        self.assertIn('message', response.data)

    def test_register_user_duplicate(self):
        self.client.logout()
        data = {'username': 'testuser', 'password': '123456'}
        response = self.client.post('/api/register/', data)
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.data)