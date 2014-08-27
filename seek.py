# -*- coding: utf-8 -*-
import time, datetime, MySQLdb, requests

#global var
simNumber = 0
balance = 0

def seekBalance():
    data = """
<ROOT>
<TEL_NO>%(sim)s</TEL_NO>
<PS>123123</PS>
<EB>1</EB>
<CLIENT_VER>1.8.5</CLIENT_VER>
<SYS_TYPE>1</SYS_TYPE>
</ROOT>
"""
    global simNumber
    global balance

    data = data % {"sim" : simNumber}
    headers = {'Content-Type': 'application/xml'} # set what your server accepts
    s = requests.session()
    try:
        r1 = s.post('https://clientaccess.10086.cn:9043/tcpbus/mobile?code=291', data = data, headers = headers, verify = False)
        r2 = s.post('https://clientaccess.10086.cn:9043/tcpbus/mobile?code=701', data = data, headers = headers, verify = False)
    except:
        print "network error, wait 20 seconds..."
        time.sleep(20)
        seekBalance()
    else:
        balance = r2.text.replace("<ROOT><BALANCE>","").replace("</BALANCE></ROOT>","")
        if balance == "":
            balance = 99999
    
    try:
        balance = float(balance)
    except:
        print "conver error, wait 10 seconds..."
        time.sleep(10)
        seekBalance()

    return balance




conn = MySQLdb.connect(host = "localhost", user = "root", passwd = "111", db = "balance", charset = "utf8", unix_socket = "/opt/lampp/var/mysql/mysql.sock")
cursor = conn.cursor()

today = datetime.date.today()
yestoday = today - datetime.timedelta(2)
sql = "select sim from baseinfo where lastcheck < '" + str(yestoday) + "'"
cursor.execute(sql)
for sims in cursor.fetchall():
    for sim in sims:
        #global simNumber
        simNumber = sim
        balance = seekBalance()

        #插入detail表
        sql = "insert into detail(sim, date, balance) values(%s, %s, %s)"
        param = (sim, datetime.date.today(), balance)
        cursor.execute(sql, param)
        conn.commit()

        #修改baseinfo表
        sql = "update baseinfo set lastcheck = %s, current = %s where sim = %s"
        param = (datetime.date.today(), balance, sim)
        cursor.execute(sql, param)
        conn.commit()

        #输出运行结果
        print sim + " " + str(balance)
        time.sleep(30)

cursor.close()
        