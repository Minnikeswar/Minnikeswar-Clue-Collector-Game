from flask import Flask, redirect , render_template , request,session
import os
import psycopg2

conn = psycopg2.connect("postgres://myproject_2tw6_user:oNqjcN8Xa9ZwZtQMw2CstKuA29ntwJWq@dpg-cgubp482qv2fdecof7q0-a.singapore-postgres.render.com/myproject_2tw6")
cursor = conn.cursor()

app = Flask(__name__)

app.secret_key=os.urandom(24)

@app.route('/')
def welcome_page():
    if('user_id' in session):
        return redirect('/homepage')
    return render_template('welcome.html')

@app.route('/signup/')
def signup_page(message = None):
    if(message != None):
        return render_template('Signup.html' , message = message)
    return render_template('Signup.html')

@app.route('/login/')
def login_page(message = None):
    if(message != None):
        return render_template('login.html' , message = message)
    return render_template('login.html', message = 'Welcome Back')

@app.route('/homepage')
def homepage():
    if('username' not in session):
        return redirect('/')
    session['curr_page'] = 0
    cursor.execute("""select * from users where username like '{}'""".format(session['username']))
    a = cursor.fetchall()
    rating = 0
    if(a[0][-1] != 0):
        rating = (a[0][-2] // a[0][-1])
    return render_template('homepage.html', username = session['username'] , email = session['email'] , rating = rating , games = a[0][-1])

@app.route('/clue-1/',methods=['GET'])
def first_page():
    if('username' not in session):
        return redirect('/')
    if(session['curr_page'] != 0 and session['curr_page'] != 1):
        return redirect(f"/clue-{session['curr_page']}")
    session['curr_page'] = 1
    cursor.execute("""select * from users where username = '{}'""".format(session['username']))
    a = cursor.fetchall()
    print(a)
    cursor.execute("""update users set round_played = '{}' where username = '{}'""".format(a[0][-1] + 1 , session['username']))
    conn.commit()
    return render_template('killer.html')

@app.route('/clue-2', methods = ['GET'])
def second_page():
    if('username' not in session):
        return redirect('/')
    if(session['curr_page'] != 1 and session['curr_page'] != 2):
        return redirect(f"/clue-{session['curr_page']}")
    session['curr_page'] = 2
    temp = int(request.args.get('data'))
    if(temp!= None):
        x = 100 - temp*50
        session['user_score'] += x
    return render_template('memory.html')

@app.route('/clue-3', methods = ['GET'])
def third_page():
    if('username' not in session):
        return redirect('/')
    if(session['curr_page'] != 2 and session['curr_page'] != 3 ):
        if(session['curr_page'] == -1):
            return redirect('/')
        else :
            return redirect(f"/clue-{session['curr_page']}")
    session['curr_page'] = 3
    temp = int(request.args.get('data'))
    if(temp!= None):
        x = 100 - temp*3
        session['user_score'] += min(0,x)
    return render_template('mole.html')

@app.route('/clue-4', methods = ['GET'])
def fourth_page():
    if('username' not in session):
        return redirect('/')
    if(session['curr_page'] != 3 and session['curr_page'] != 4):
        return redirect(f"/clue-{session['curr_page']}")
    session['curr_page'] = 4
    temp = int(request.args.get('data'))
    if(temp!= None):
        x = (100 - ( temp - 15 )*2 )
        session['user_score'] += min(0,x)
    return render_template('sudoku.html')

@app.route('/clue-5', methods = ['GET'])
def final_page():
    if('username' not in session):
        return redirect('/')
    if(session['curr_page'] != 4 and session['curr_page'] != 5):
        return redirect(f"/clue-{session['curr_page']}")
    session['curr_page'] = 5
    temp = int(request.args.get('data'))
    if(temp!= None):
        x = 100 - temp*2
        session['user_score'] += min(0,x)
    return render_template('treasure.html')

@app.route('/exit')
def exit():
    cursor.execute("""select * from users where username like '{}'""".format(session['username']))
    a = cursor.fetchall()
    totalScore = session['user_score'] + int(a[0][-1])
    cursor.execute("""update users set totalscore = '{}' where username like '{}'""".format(totalScore,session['username']))
    conn.commit()
    session.pop('username')
    session.pop('email')
    session.pop('user_score')
    session.pop('current_page')
    return redirect('/')

@app.route('/login-validation' , methods =['POST'])
def validate():
    username = request.form.get('username-email')
    password = request.form.get('password')
    if(username.find('@') != -1 and username.find('.com') != -1):
        cursor.execute("""select * from users where email_id like '{}' and password like '{}'""".format(username,password))
    else:
        cursor.execute("""select * from users where username like '{}' and password like '{}'""".format(username,password))
    userlog = cursor.fetchall()
    if(len(userlog) < 1):
        return login_page('Invalid credentials')
    else:
        session['username'] = userlog[0][0]
        session['email'] = userlog[0][1]
        session['user_score'] = 0
        session['current_page'] = 0
        return redirect('/homepage')

@app.route('/signup-validation' , methods =['POST'])
def register():
    username = request.form.get('username')
    email = request.form.get('email')
    password = request.form.get('password')
    re_password = request.form.get('re-password')
    if(re_password != password):
        return signup_page('Password mismatch')
    else:
        cursor.execute("""select * from users where username like '{}'""".format(username))
        if(len(cursor.fetchall()) > 0):
            return signup_page('Username already exists')
        cursor.execute("""select * from users where email_id like '{}'""".format(email))
        if(len(cursor.fetchall()) > 0):
            return signup_page('Email already exists')
        cursor.execute("""insert into users values('{}','{}','{}','{}','{}')""".format(username,email,password,0,0))
        conn.commit()
        return signup_page('SUCESSFULLY REGISTERED!!!')
        
if __name__ == '__main__':
    app.debug = True
    app.run()