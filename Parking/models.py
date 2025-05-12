from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin

# Initialize SQLAlchemy
db = SQLAlchemy()

# User Model

class User(UserMixin, db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    date_registered = db.Column(db.DateTime, default=db.func.current_timestamp())

class ParkingSlot(db.Model):
    __tablename__ = 'parking_slots'
    id = db.Column(db.Integer, primary_key=True)
    slot_number = db.Column(db.String(10), unique=True, nullable=False)
    location = db.Column(db.String(100))
    available = db.Column(db.Boolean, default=True)
    price_per_hour = db.Column(db.Float)
class Booking(db.Model):
    __tablename__ = 'bookings'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    parking_slot = db.Column(db.String(100), nullable=False)
    booking_date = db.Column(db.String(100), nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    
    user = db.relationship('User', backref=db.backref('bookings', lazy=True))
    def __repr__(self):
        return f"ParkingSlot('{self.location}', '{self.price}', '{self.available}')"
