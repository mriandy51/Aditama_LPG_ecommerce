from flask import Blueprint, render_template, flash, redirect, request, jsonify
from .models import Product, Cart, ProductVariant
from flask_login import login_required, current_user
from . import db

shop = Blueprint('shop', __name__)


@shop.route('/shop')
def shops():
    products = Product.query.filter_by(is_active=True)\
        .order_by(Product.date_added).all()
        

    return render_template('shop.html', 
                         products=products,
                         cart=Cart.query.filter_by(customer_link=current_user.id).all() if current_user.is_authenticated else [])