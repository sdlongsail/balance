# -*- coding: utf-8 -*-
import time, datetime, MySQLdb, requests

#计算阅读余额
def balanceOfMonth(sim, month):
    global conn
    global cursor
    global sql

    sql = 'select balance from detail where sim = ' + sim + ' and month(date) = ' + str(month)
    cursor.execute(sql)

    balance = cursor.fetchall()
    balance = min(balance)

    return balance[0]

#计算月度话费
def amountOfMonth(sim, month):
    global conn
    global cursor
    global sql

    sql = 'select balance from monthly where sim = ' + sim + ' and month(month) = ' + str(month)
    cursor.execute(sql)
    currentMonthBalacne = cursor.fetchall()
    currentMonthBalacne = currentMonthBalacne[0]

    sql = 'select balance from monthly where sim = ' + sim + ' and month(month) = ' + str(month - 1)
    cursor.execute(sql)
    lastMonthBalance = cursor.fetchall()
    lastMonthBalance = lastMonthBalance[0]

    currentAmount = currentMonthBalacne - lastMonthBalance
    return currentAmount





conn = MySQLdb.connect(host = "localhost", user = "root", passwd = "111", db = "balance_test", charset = "utf8", unix_socket = "/opt/lampp/var/mysql/mysql.sock")
cursor = conn.cursor()
sql = 'select sim from baseinfo'
cursor.execute(sql)
for sims in cursor.fetchall():
    for sim in sims:
        balance = balanceOfMonth(sim, 8)
        print str(sim) + ' ' + str(balance)

        #插入monthly表
        sql = "insert into monthly(sim, month, balance,amount) values(%s, %s, %s, %s)"
        param = (sim, datetime.datetime.strptime('2014-08-01', '%Y-%m-%d'), balance, 0)
        cursor.execute(sql, param)
        conn.commit()
