from flask import Flask, jsonify, render_template, redirect, url_for, request
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from models import Booking, db, User, ParkingSlot
from werkzeug.security import generate_password_hash, check_password_hash
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import InputRequired, Email, Length
from flask import flash

app = Flask(__name__)
app.config.from_object('config.Config')

# Initialize Database
db.init_app(app)

# Initialize Login Manager
login_manager = LoginManager(app)
login_manager.login_view = 'login'

# User loader for Flask-Login
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Sign Up Form
class SignupForm(FlaskForm):
    username = StringField('Username', validators=[InputRequired(), Length(min=4, max=20)])
    email = StringField('Email', validators=[InputRequired(), Email()])
    password = PasswordField('Password', validators=[InputRequired(), Length(min=6, max=20)])
    submit = SubmitField('Sign Up')

# Login Form
class LoginForm(FlaskForm):
    username = StringField('Username', validators=[InputRequired()])
    password = PasswordField('Password', validators=[InputRequired()])
    submit = SubmitField('Log In')

@app.route('/')
def index():
    return render_template('index.html')
@app.route('/about')
def about():
    return render_template('aboutus.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    form = SignupForm()
    if form.validate_on_submit():
        hashed_password = generate_password_hash(form.password.data)
        user = User(username=form.username.data, email=form.email.data, password=hashed_password)
        db.session.add(user)
        db.session.commit()
        # Add a flash message for success
        from flask import flash
        flash('Account created successfully! Please log in.', 'success')
        return redirect(url_for('login'))
    return render_template('signup.html', form=form)

@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user and check_password_hash(user.password, form.password.data):
            login_user(user)
            return redirect(url_for('dashboard'))
    return render_template('login.html', form=form)

@app.route('/dashboard')
@login_required
def dashboard():
    parking_slots = ParkingSlot.query.filter_by(available=True).all()
    return render_template('dashboard.html', parking_slots=parking_slots)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))

@app.route('/booking/<location>', methods=['GET', 'POST'])
@login_required
def booking(location):
    # You can use the location parameter to pre-select the location in the booking form
    return render_template('booking.html', selected_location=location)

@app.route('/process_booking', methods=['POST'])
@login_required
def process_booking():
    if request.method == 'POST':
        # Extract form data - updated to match the actual form field names in booking.html
        parking_slot = request.form.get('parking_slot')
        # Since booking date is hardcoded in the JavaScript as February 20, 2025
        booking_date = request.form.get('booking_date', 'February 20, 2025')
        full_name = request.form.get('full_name')
        email = request.form.get('email')
        phone = request.form.get('phone')
        
        # Save the booking to the database
        try:
            new_booking = Booking(
                user_id=current_user.id,
                parking_slot=parking_slot,
                booking_date=booking_date,
                full_name=full_name,
                email=email,
                phone=phone
            )
            
            db.session.add(new_booking)
            db.session.commit()
            return jsonify({'success': True, 'message': 'Booking confirmed successfully'})
        except Exception as e:
            db.session.rollback()
            print(f"Error saving booking: {str(e)}")
            return jsonify({'success': False, 'message': 'Database error occurred'})
    
    return jsonify({'success': False, 'message': 'Invalid request'})
if __name__ == '__main__':
    app.run(debug=True)
