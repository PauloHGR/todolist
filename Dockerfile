FROM python:3.12

WORKDIR /app

COPY requirements.txt .
RUN pip3 install --upgrade pip && pip3 install -r requirements.txt

COPY . .

WORKDIR /app/ToDoListProject

CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]
