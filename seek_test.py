import time, datetime, MySQLdb, requests
import xml.etree.cElementTree as ET

def seekBalance():

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

    loginData = loginData % {'sim' : sim}
    balanceData = balanceData % {'sim' : sim}

    headers = {'Content-Type': 'application/xml', 'User-agent': 'GreenPoint.Inc'} # set what your server accepts
    s = requests.session()
    try:
        rLogin = s.post('https://clientaccess.10086.cn:9043/tcpbus/mobile?code=291', data = loginData, headers = headers, verify = False)
        rBalance = s.post('https://clientaccess.10086.cn:9043/tcpbus/mobile?code=701', data = balanceData, headers = headers, verify = False)
    except:
        print "network error, wait 20 seconds..."
        time.sleep(20)
        seekBalance()
    else:
        root = ET.fromstring(rBalance.text)
        balance = root[0].text
        if balance == "":
            balance = 99999
    
    try:
        balance = float(balance)
    except:
        print "convert error, wait 10 seconds..."
        time.sleep(10)
        seekBalance()

    return balance


def seekBill():

    global sim
    global month
    global bill

    loginData = """
<ROOT>
<TEL_NO>%(sim)s</TEL_NO>
<PS>123123</PS>
<EB>1</EB>
<CLIENT_VER>1.9.1</CLIENT_VER>
<SYS_TYPE>1</SYS_TYPE>
</ROOT>
"""

    billData = '''
<ROOT>
<TEL_NO>%(sim)s</TEL_NO>
<QUERY_DATE>%(month)s</QUERY_DATE>
<LOC_CITY>0539</LOC_CITY>
<LOC_PROVINCE>531</LOC_PROVINCE>
</ROOT>
'''

    loginData = loginData % {'sim':sim}
    billData = billData % {'sim':sim, 'month':month}

    headers = {'Content-Type': 'application/xml', 'User-agent': 'GreenPoint.Inc'} # set what your server accepts
    s = requests.session()
    try:
        rLogin = s.post('https://clientaccess.10086.cn:9043/tcpbus/mobile?code=291', data = loginData, headers = headers, verify = False)
        rBill = s.post('https://clientaccess.10086.cn:9043/tcpbus/mobile?code=1101', data = billData, headers = headers, verify = False)
    except:
        print "network error, wait 20 seconds..."
        time.sleep(20)
        seekBill()
    else:
        root = ET.fromstring(rBill.text.encode('utf8'))
        bill = root[0][0][1].text

    try:
        bill = float(bill)
    except:
        print "convert error, wait 10 seconds..."
        time.sleep(10)
        seekBill()

    return bill

def seekPayment():

    global sim


sim = '13455918640'
month = '06'
balance = seekBalance()
bill = seekBill()
print balance
print bill
