FROM python:3.11
WORKDIR /code
COPY ./requirements.txt /code/requirements.txt
RUN pip install --root-user-action=ignore --no-cache-dir --upgrade -r /code/requirements.txt
RUN rm -rf /root/.cache/
COPY ./app /code/app
COPY ./logging.conf /code/logging.conf
COPY ./.env /code/.env
# CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8002", "--reload", "--env-file", ".env"]
# no reload
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8002", "--env-file", ".env"]