from rest_framework.response import Response
from rest_framework import status
from .models import Task
from .serializers import TaskSerializer
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework import filters
from rest_framework.pagination import PageNumberPagination

def apply_filters(request, tasks):
    searchTitle = request.GET.get('search')
    if searchTitle:
        tasks = tasks.filter(title__icontains=searchTitle)
    
    searchIsCompleted = request.GET.get('completed')
    if searchIsCompleted in ['true', 'false']:
        tasks = tasks.filter(completed=(searchIsCompleted == 'true'))

    return tasks

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def task_list(request):
    if request.method == 'GET':
        tasks = Task.objects.all()
        tasks = apply_filters(request, tasks)

        paginator = PageNumberPagination()
        paginator.page_size = 2
        result = paginator.paginate_queryset(tasks, request)
        serializer = TaskSerializer(result, many=True)
        return paginator.get_paginated_response(serializer.data)
    
    elif request.method == 'POST':
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def task_detail(request, pk):
    try:
        task = Task.objects.get(pk=pk)
    except Task.DoesNotExist:
        return Response({'error': 'Tarefa não encontrada'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = TaskSerializer(task)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = TaskSerializer(task, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        task.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Usuário já existe'}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, password=password)
    return Response({'message': 'Usuário criado com sucesso'}, status=status.HTTP_201_CREATED)