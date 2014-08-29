# -*- coding: utf-8 -*-
import time, datetime, MySQLdb, requests

def minOfMonth(sim, month):
    global conn
    global cursor
    global sql

    sql = 'select balance from detail where sim = ' + sim + ' and month(date) = ' + str(month)
    cursor.execute(sql)

    balance = cursor.fetchall()
    balance = min(balance)

    return balance[0]





conn = MySQLdb.connect(host = "localhost", user = "root", passwd = "111", db = "balance_test", charset = "utf8", unix_socket = "/opt/lampp/var/mysql/mysql.sock")
cursor = conn.cursor()
sql = 'select sim from baseinfo where id > 1880 and id < 1882'
cursor.execute(sql)
for sims in cursor.fetchall():
    for sim in sims:
        balance = minOfMonth(sim, 8)
        print str(sim) + ' ' + str(balance)

