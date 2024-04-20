from flask import Flask, abort, render_template, request, send_file
import requests

app = Flask(__name__)


@app.route("/")
def index():
  return render_template("index.html")


@app.route("/upload", methods=["POST"])
def upload():
  file = request.files.get('file')

  try:
    url = 'https://0x0.st'
    data = {'file': file}

    response = requests.post(url, files=data)

    if response.status_code == 200:
      return response.text.strip()
    else:
      return abort(response.text), response.status_code

  except requests.exceptions.RequestException as e:
    print("Error uploading file:", e)


@app.route("/download")
def download():
  url = request.args.get('url')

  if url:
    return send_file(url, as_attachment=True)
  else:
    abort("Missing file URL."), 422
