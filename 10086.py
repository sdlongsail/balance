# -*- coding: utf-8 -*-
import requests
data = """
<ROOT>
<TEL_NO>%(sim)s</TEL_NO>
<PS>123123</PS>
<EB>1</EB>
<CLIENT_VER>1.8.5</CLIENT_VER>
<SYS_TYPE>1</SYS_TYPE>
</ROOT>
"""
number = "13853917410"
data = data % {"sim" : number}

headers = {'Content-Type': 'application/xml'} # set what your server accepts

s = requests.session()
r1 = s.post('https://clientaccess.10086.cn:9043/tcpbus/mobile?code=291', data=data, headers=headers, verify=False)
r2 = s.post('https://clientaccess.10086.cn:9043/tcpbus/mobile?code=701', data=data, headers=headers, verify=False)
balance = r2.text.replace("<ROOT><BALANCE>","").replace("</BALANCE></ROOT>","")
print balance

if balance == "":
    print "this is null"