from flask import render_template
from flask import Blueprint
from flask import url_for
from flask import jsonify
from flask import request
from backend import get_conn
import os
import requests
from multiprocessing import Process
import json, time
from datetime import datetime

main = Blueprint('main', __name__, template_folder='templates', static_folder='static', static_url_path="/static")

@main.route('/', defaults={'path': ''})
# @main.route('/<path:path>')
def index(path):
  return render_template('index.html')

def reminder(action, open_id):
  option = action["option"]
  year = int(option[0:4])
  month = int(option[5:7])
  day = int(option[8:10])  
  hour = int(option[11:13])
  minute = int(option[14:16])

  time.sleep((datetime(year,month,day,hour,minute,0)-datetime.now()).seconds)

  data = {
          "open_id": open_id,
          "msg_type": "interactive",
          "update_multi": False,
          "card": {
            "header": {
              "title": {
                  "tag": "plain_text",
                  "content": "Your reminder message"
              },
              "template":"blue"
            },
            "i18n_elements": {
              "zh_cn": [
                {
                  "tag": "div",
                  "text": {
                    "tag": "lark_md",
                    "content": "**"+action["value"]["title"]+"**"
                  }
                },
                {
                  "tag": "div",
                  "text": {
                    "tag": "lark_md",
                    "content": "[Click to view assignment]("+action["value"]["url"]+")"
                  }
                }
              ]
            }
          }
  }

  header = {
    "Authorization": 'Bearer '+ action["value"]["token"],
    "Content-Type": "application/json; charset=utf-8"
  }

  r = requests.post("https://open.feishu.cn/open-apis/message/v4/send/", data=json.dumps(data), headers=header)

  print(r.text)

@main.route('/api/', methods=["GET", "POST"])
def respond():
  open_id = request.json.get("open_id")
  token = request.json.get("token")
  action = request.json.get("action")
  print(open_id)
  print(token)
  print(action)

  p=Process(target=reminder,args=(action,open_id))
  p.start()

  return {
            "header": {
              "title": {
                  "tag": "plain_text",
                  "content": "Assignment notification"
              },
              "template":"blue"
            },
            "i18n_elements": {
              "zh_cn": [
                {
                  "tag": "div",
                  "text": {
                    "tag": "lark_md",
                    "content": "**"+action["value"]["title"]+"**"
                  }
                },
                {
                  "tag": "div",
                  "text": {
                    "tag": "lark_md",
                    "content": "[Click to view assignment]("+action["value"]["url"]+")"
                  }
                },
                {
                  "tag": "div",
                  "text": {
                    "tag": "lark_md",
                    "content": "**Reminder Created**"
                  }
                }
              ]
            }
          }

@main.route('/api/', methods=["GET", "POST"])
def test():
  challenge = request.form.get("challenge")
  print(challenge)
  print(request.form)
  print(request.args)

  return {
    "challenge": challenge
  }

@main.route('/course/', methods=["GET"])
def get_all_course():
  conn = get_conn()
  cur = conn.cursor()
  cur.execute("SELECT * FROM course")
  return jsonify(cur.fetchall())
  
@main.route('/course/<int:CID>/', methods=["GET"])
# NEW ADDED: courseInf serversfunction
def get_course(CID):
  conn = get_conn()
  cur = conn.cursor()
  sql = "SELECT C.courseName, C.time, C.size, C.capacity, C.credit, C.courseIntro, C.syllabusLink,\
    P.profName, P.email, P.office, P.bio, P.profile, C.event_id, C.chat_id, R.location \
    FROM course C LEFT JOIN professor P ON C.professor = P.profID\
    LEFT JOIN classroom R on C.classroom = R.classroomID\
    WHERE C.courseID= %s ; "
  cur.execute(
    sql, (CID))
  return jsonify(cur.fetchall())

@main.route('/addCourse/', methods=["GET", "POST"])
# NEW ADDED: courseInf serversfunction
def add_course():
  courseID = request.args.get('courseID')
  studentID = request.args.get('studentID')
  semester = request.args.get('semester')
  attendee_id = request.args.get('attendee_id')
  conn = get_conn()
  cur = conn.cursor()
  cur.execute("insert into studentcourse (studentID, courseID, semester, grade, attendee_id)\
  values (%s, %s, %s, %s, %s)",(studentID, courseID, semester, "0", attendee_id))
  cur.execute("UPDATE course SET size = size + 1 \
  WHERE courseID = %s ", (courseID))
  conn.commit()
  return {}


@main.route('/dropCourse/', methods=["GET", "POST"])
# NEW ADDED: courseInf serversfunction
def drop_course():
  courseID = request.args.get('courseID')
  studentID = request.args.get('studentID')
  semester = request.args.get('semester')
  conn = get_conn()
  cur = conn.cursor()
  cur.execute("DELETE FROM studentcourse WHERE studentID = %s and courseID=%s and semester=%s",
  (studentID, courseID, semester))
  cur.execute("UPDATE course SET size = size - 1 \
  WHERE courseID = %s ", (courseID))
  conn.commit()
  return {}

@main.route('/isSelected/', methods=["GET", "POST"])
# NEW ADDED: courseInf serversfunction
def is_selected():
  courseID = request.args.get('courseID')
  studentID = request.args.get('studentID')
  semester = request.args.get('semester')
  conn = get_conn()
  cur = conn.cursor()
  cur.execute("SELECT * FROM studentcourse WHERE studentID = %s and courseID=%s and semester=%s",
  (studentID, courseID, semester))
  return jsonify(cur.fetchall())


@main.route('/selectedCourse/', methods=["GET", "POST"])
# NEW ADDED: selectedCourse serversfunction
def selected():
  studentID = request.args.get('studentID')
  semester = request.args.get('semester')
  conn = get_conn()
  cur = conn.cursor()
  cur.execute("select studentcourse.courseID, courseName, time, professor.profName, location, course.capacity, credit\
   from studentcourse\
   left join course on course.courseID = studentcourse.courseID\
   left join professor on professor = profID\
   left join classroom on classroom = classroomID\
   where studentID = %s and studentcourse.semester = %s",
  (studentID, semester))
  return jsonify(cur.fetchall())




@main.route('/api/id/', methods=["GET", "POST"])
def find_name():
  ID = request.args.get('ID')
  conn = get_conn()
  cur = conn.cursor()
  cur.execute("select studentID, studentName, role from student where userID = %s",(ID))
  return jsonify(cur.fetchone())

@main.route('/api/register/', methods=["GET", "POST"])
def register():
  name = request.args.get('name')
  ID = request.args.get('ID')
  openid = request.args.get('openid')
  role = request.args.get('role')
  conn = get_conn()
  cur = conn.cursor()
  cur.execute("insert into student (studentID, studentName, userID, role) values (%s, %s, %s, %s)",(ID, name, openid, role))
  conn.commit()
  return {}

@main.route('/api/search/', methods=["GET", "POST"])
def search():
  term = request.args.get('term')
  print(repr(term))
  name = request.args.get('name')
  prof = request.args.get('prof')
  major = request.args.get('major')
  level = request.args.get('level')
  category = request.args.get('category')
  credit = request.args.get('credit')
  conn = get_conn()
  cur = conn.cursor()
  cur.execute("select course.courseID, courseName, time, profName, location, course.capacity, credit\
   from course\
   left join classroom on classroom = classroomID\
   left join professor on professor = profID\
   left join coursecategory on course.courseID = coursecategory.courseID\
   left join category on coursecategory.categoryID = category.categoryID \
   where courseName like %s\
   and semester = %s\
   and profName like %s\
   and major like %s\
   and level like %s\
   and categoryName like %s\
   and credit like %s"
   ,('%'+name+'%', term, '%'+prof+'%', '%'+major+'%', '%'+level+'%', '%'+category+'%', '%'+credit+'%'))
  return jsonify(cur.fetchall())

@main.route('/api/getAnnouncement/', methods=["GET", "POST"])
def get_announcement():
  courseID = request.args.get('courseID')
  conn = get_conn()
  cur = conn.cursor()
  cur.execute("select title, content, studentName, time\
   from announcement\
   left join student on author = studentID\
   where courseID = %s",(courseID))
  return jsonify(cur.fetchall())

@main.route('/api/addAnnouncement/', methods=["GET", "POST"])
def add_announcement():
  courseID = request.args.get('courseID')
  title = request.args.get('title')
  content = request.args.get('content')
  author = request.args.get('author')
  conn = get_conn()
  cur = conn.cursor()
  cur.execute("insert into announcement (title, courseID, content, author, time)\
  values (%s, %s, %s, %s, CURRENT_TIMESTAMP)",(title, courseID, content, author))
  conn.commit()
  return jsonify(cur.fetchall())

@main.route('/api/getAssignment/', methods=["GET", "POST"])
def get_assignment():
  courseID = request.args.get('courseID')
  studentID = request.args.get('studentID')
  conn = get_conn()
  cur = conn.cursor()
  cur.execute("select a.assignmentID, ddl, score, fullscore, title\
   from (select assignmentID, ddl, fullscore, title from assignment where courseID = %s) a\
   left join (select assignmentID, score from score where owner = %s) s on a.assignmentID = s.assignmentID \
   ",(courseID, studentID))
  return jsonify(cur.fetchall())

@main.route('/api/getOneAssignment/', methods=["GET", "POST"])
def get_one_assignment():
  assignmentID = request.args.get('assignmentID')
  studentID = request.args.get('studentID')
  conn = get_conn()
  cur = conn.cursor()
  cur.execute("select a.assignmentID, ddl, score, fullscore, title, content, submitted\
   from (select assignmentID, ddl, fullscore, title, content from assignment where assignmentID = %s) a\
   left join (select assignmentID, score, submitted from score where owner = %s) s on a.assignmentID = s.assignmentID \
   ",(assignmentID, studentID))
  return jsonify(cur.fetchone())

@main.route('/api/submitAssignment/', methods=["GET", "POST"])
def submit_assignment():
  url = request.args.get('url')
  assignmentID = request.args.get('assignmentID')
  studentID = request.args.get('studentID')
  conn = get_conn()
  cur = conn.cursor()
  cur.execute("select submitted\
   from score\
   where assignmentID = %s and owner = %s",(assignmentID, studentID))
  res = cur.fetchall()
  if not res:
      cur.execute("insert into score (owner, assignmentID, submitted)\
      values (%s, %s, %s)",(studentID, assignmentID, url))
  else:
      cur.execute("update score set submitted = %s\
      where assignmentID = %s and owner = %s",(url, assignmentID, studentID))
  conn.commit()
  return {}

@main.route('/api/createAssignment/', methods=["GET", "POST"])
def create_assignment():
  date = request.args.get('date')
  time = request.args.get('time')
  title = request.args.get('title')
  fullscore = request.args.get('fullscore')
  url = request.args.get('url')
  courseID = request.args.get('courseID')
  conn = get_conn()
  cur = conn.cursor()
  cur.execute("insert into assignment (ddl, fullscore, title, content, courseID)\
   values (%s, %s, %s, %s, %s)",(date+" "+time, fullscore, title, url, courseID))
  conn.commit()
  return {}

@main.route('/api/showSubmission/', methods=["GET", "POST"])
def show_submission():
  assignmentID = request.args.get('assignmentID')
  conn = get_conn()
  cur = conn.cursor()
  cur.execute("select owner, submitted, score\
   from score\
   where assignmentID = %s",(assignmentID))
  return jsonify(cur.fetchall())

@main.route('/api/grade/', methods=["GET", "POST"])
def grade():
  assignmentID = request.args.get('assignmentID')
  studentID = request.args.get('studentID')
  score = request.args.get('score')
  conn = get_conn()
  cur = conn.cursor()
  cur.execute("update score set score = %s\
  where assignmentID = %s and owner = %s",(score, assignmentID, studentID))
  conn.commit()
  return jsonify(cur.fetchall())

@main.route('/api/getCourse/', methods=["GET", "POST"])
def getCourse():
  studentID = request.args.get('studentID')
  conn = get_conn()
  cur = conn.cursor()
  cur.execute("select courseName, studentcourse.courseID from studentcourse\
  left join course on studentcourse.courseID = course.courseID\
  where studentID = %s",(studentID))
  return jsonify(cur.fetchall())

@main.route('/api/getFeedback/', methods=["GET", "POST"])
def getFeedback():
  studentID = request.args.get('studentID')
  conn = get_conn()
  cur = conn.cursor()
  cur.execute("select courseName, title, fullscore, score, assignment.assignmentID from score\
  left join assignment on score.assignmentID = assignment.assignmentID\
  left join course on course.courseID = assignment.courseID\
  where owner = %s and score is not null\
  limit 3",(studentID))
  return jsonify(cur.fetchall())

@main.route('/api/getTodo/', methods=["GET", "POST"])
def getTodo():
  studentID = request.args.get('studentID')
  conn = get_conn()
  cur = conn.cursor()
  cur.execute("select courseName, title, ddl, a.assignmentID from\
  (select courseName, title, ddl, assignment.assignmentID, studentID from assignment\
  left join studentcourse on studentcourse.courseID = assignment.courseID\
  left join course on course.courseID = studentcourse.courseID where studentID = %s) a \
  left join (select assignmentID, submitted, owner from score) s on a.assignmentID = s.assignmentID and a.studentID = s.owner\
  where s.submitted is null\
  order by ddl\
  limit 3",(studentID))
  return jsonify(cur.fetchall())

@main.route('/api/getWebhook/', methods=["GET", "POST"])
def getWebhook():
  courseID = request.args.get('courseID')
  conn = get_conn()
  cur = conn.cursor()
  cur.execute("select chat_id from course\
  where courseID = %s",(courseID))
  return jsonify(cur.fetchone())