# -*- coding: utf-8 -*-
import time, datetime, MySQLdb, requests

data = """
<ROOT>
<TEL_NO>%(tel)s</TEL_NO>
<PS>123123</PS>
<EB>1</EB>
<CLIENT_VER>1.8.5</CLIENT_VER>
<SYS_TYPE>1</SYS_TYPE>
</ROOT>
"""

conn = MySQLdb.connect(host = "127.0.0.1", user = "root", passwd = "111", db = "longsail", charset = "utf8")
cursor = conn.cursor()

n = cursor.execute("select sim from baseinfo where id > 120")
for sims in cursor.fetchall():
    for sim in sims:
        data = data %{"tel" : sim}
        headers = {'Content-Type': 'application/xml'} 
        s = requests.session()
        r1 = s.post('https://clientaccess.10086.cn:9043/tcpbus/mobile?code=291', data=data, headers=headers, verify=False)
        r2 = s.post('https://clientaccess.10086.cn:9043/tcpbus/mobile?code=701', data=data, headers=headers, verify=False)
        balance = r2.text.replace("<ROOT><BALANCE>","").replace("</BALANCE></ROOT>","")
        if balance == "":
            balance = "wrong passwd"
        print sim + " - " + balance
        time.sleep(30)


sql = "insert into balance(sim, date, balance) values(%s, %s, %s)"
param = ("13812341234", datetime.date.today(), 30.5)
n = cursor.execute(sql, param)
#conn.commit()

cursor.close()