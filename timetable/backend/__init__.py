from flask import Flask,render_template,g,session
from flaskext.mysql import MySQL
import pymysql

def creat_app():
    app = Flask(__name__,template_folder="templates",static_folder="static",static_url_path="/backend/static")
    from . import main
    app.register_blueprint(main.main)
    app.config['SECRET_KEY'] = ''
    app.debug = True
    return app

def get_conn():
    return pymysql.connect(user="root", password="Umsjtuji2021",
                    host="rm-bp15pegfok15si301xo.mysql.rds.aliyuncs.com", db="main")