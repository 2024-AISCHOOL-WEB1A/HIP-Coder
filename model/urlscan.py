from flask import Blueprint, request, jsonify
import pymysql
from config.db import db_con

urlscan_bp = Blueprint('urlscan', __name__)

@urlscan_bp.route('/test', methods = ['GET'])
def test():
    return jsonify({'test': 'test'})


@urlscan_bp.route('/scan', methods = ['POST'])
def scanurl():
    
    return