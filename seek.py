# -*- coding: utf-8 -*-
import time, datetime, MySQLdb, requests
import xml.etree.cElementTree as ET

def seek():
    #声明全局变量
    global sim
    global balance

    loginData = """
<ROOT>
<TEL_NO>%(sim)s</TEL_NO>
<PS>123123</PS>
<EB>1</EB>
<CLIENT_VER>1.9.1</CLIENT_VER>
<SYS_TYPE>1</SYS_TYPE>
</ROOT>
"""
    
    balanceData = '''
<ROOT>
<TEL_NO>%(sim)s</TEL_NO>
</ROOT>
'''

    billData = '''
<ROOT>
<TEL_NO>%(sim)s</TEL_NO>
<QUERY_DATE>06</QUERY_DATE>
<LOC_CITY>0539</LOC_CITY>
<LOC_PROVINCE>531</LOC_PROVINCE>
</ROOT>
'''
    
    infoData = '''
<ROOT>
<TEL_NO>%(sim)s</TEL_NO>
<LOC_CITY>0539</LOC_CITY>
<LOC_PROVINCE>531</LOC_PROVINCE>
</ROOT>
'''

    payHistoryData = '''
<ROOT>
<TEL_NO>%(sim)s</TEL_NO>
<LOC_CITY>0539</LOC_CITY>
<LOC_PROVINCE>531</LOC_PROVINCE>
</ROOT>
'''

    loginData = loginData % {'sim' : sim}
    balanceData = balanceData % {'sim' : sim}
    billData = billData % {'sim' : sim}
    infoData = infoData % {'sim' : sim}
    payHistoryData = payHistoryData % {'sim' : sim}

    headers = {'Content-Type': 'application/xml', 'User-agent': 'GreenPoint.Inc'} # set what your server accepts
    s = requests.session()
    try:
        rLogin = s.post('https://clientaccess.10086.cn:9043/tcpbus/mobile?code=291', data = loginData, headers = headers, verify = False)
        rBalance = s.post('https://clientaccess.10086.cn:9043/tcpbus/mobile?code=701', data = balanceData, headers = headers, verify = False)
        rBill = s.post('https://clientaccess.10086.cn:9043/tcpbus/mobile?code=1101', data = billData, headers = headers, verify = False)
        rInfo = s.post('https://clientaccess.10086.cn:9043/tcpbus/mobile?code=1401', data = infoData, headers = headers, verify = False)
        rPayHistory = s.post('https://clientaccess.10086.cn:9043/tcpbus/mobile?code=1301', data = payHistoryData, headers = headers, verify = False)        
    except:
        print "network error, wait 20 seconds..."
        time.sleep(20)
        seek()
    else:
        root = ET.fromstring(rBalance.text)
        balance = r2.text.replace("<ROOT><BALANCE>","").replace("</BALANCE></ROOT>","")
        if balance == "":
            balance = 99999
    
    try:
        balance = float(balance)
    except:
        print "convert error, wait 10 seconds..."
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
        balance = seek()

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
        