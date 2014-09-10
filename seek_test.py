import time, datetime, MySQLdb, requests
import xml.etree.cElementTree as ET

def seekBalance():

    global sim
    global balance

    loginData = '''
<ROOT>
<TEL_NO>%(sim)s</TEL_NO>
<PS>123123</PS>
<EB>1</EB>
<CLIENT_VER>1.9.1</CLIENT_VER>
<SYS_TYPE>1</SYS_TYPE>
</ROOT>
'''
    
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
        print 'network error, wait 20 seconds...'
        time.sleep(20)
        seekBalance()
    
    try:
        root = ET.fromstring(rBalance.text)
        balance = root[0].text
    except:
        
    else:
        balance = 99999

    
    try:
        balance = float(balance)
    except:
        print 'convert error, wait 10 seconds...'
        time.sleep(10)
        seekBalance()

    return balance


def seekBill():

    global sim
    global month
    global bill

    loginData = '''
<ROOT>
<TEL_NO>%(sim)s</TEL_NO>
<PS>123123</PS>
<EB>1</EB>
<CLIENT_VER>1.9.1</CLIENT_VER>
<SYS_TYPE>1</SYS_TYPE>
</ROOT>
'''

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
        print 'network error, wait 20 seconds...'
        time.sleep(20)
        seekBill()
    else:
        root = ET.fromstring(rBill.text.encode('utf8'))
        bill = root[0][0][1].text

    try:
        bill = float(bill)
    except:
        print 'convert error, wait 10 seconds...'
        time.sleep(10)
        seekBill()

    return bill

def seekPayment():

    global sim
    global paymentDate
    global paymentAmount

    loginData = '''
<ROOT>
<TEL_NO>%(sim)s</TEL_NO>
<PS>123123</PS>
<EB>1</EB>
<CLIENT_VER>1.9.1</CLIENT_VER>
<SYS_TYPE>1</SYS_TYPE>
</ROOT>
'''

    paymentData = '''
<ROOT>
<TEL_NO>%(sim)s</TEL_NO>
<LOC_CITY>0539</LOC_CITY>
<LOC_PROVINCE>531</LOC_PROVINCE>
</ROOT>
'''

    loginData = loginData % {'sim':sim}
    paymentData = paymentData % {'sim':sim}

    headers = {'Content-Type': 'application/xml', 'User-agent': 'GreenPoint.Inc'} # set what your server accepts
    s = requests.session()
    try:
        rLogin = s.post('https://clientaccess.10086.cn:9043/tcpbus/mobile?code=291', data = loginData, headers = headers, verify = False)
        rPayment = s.post('https://clientaccess.10086.cn:9043/tcpbus/mobile?code=1301', data = paymentData, headers = headers, verify = False)
    except:
        print 'network error, wait 20 seconds...'
        time.sleep(20)
        seekPayment()
    else:
        root = ET.fromstring(rPayment.text.encode('utf8'))
        paymentDate = root[0][0][1][0].text
        paymentAmount = root[0][0][1][1].text

    try:
        paymentDate = datetime.datetime.strptime(paymentDate,'%Y-%m-%d %H:%M:%S')
        paymentDate = paymentDate.date()
        paymentAmount = float(paymentAmount)
    except:
        print 'convert error, wait 10 seconds...'
        time.sleep(10)
        seekPayment()


    payment = [paymentDate, paymentAmount]
    return payment

def seekEnableDate():

    global sim
    global enableDate

    loginData = '''
<ROOT>
<TEL_NO>%(sim)s</TEL_NO>
<PS>123123</PS>
<EB>1</EB>
<CLIENT_VER>1.9.1</CLIENT_VER>
<SYS_TYPE>1</SYS_TYPE>
</ROOT>
'''

    enableData = '''
<ROOT>
<TEL_NO>%(sim)s</TEL_NO>
<LOC_CITY>0539</LOC_CITY>
<LOC_PROVINCE>531</LOC_PROVINCE>
</ROOT>
    '''

    loginData = loginData % {'sim':sim}
    enableData = enableData % {'sim':sim}

    headers = {'Content-Type': 'application/xml', 'User-agent': 'GreenPoint.Inc'} # set what your server accepts
    s = requests.session()
    try:
        rLogin = s.post('https://clientaccess.10086.cn:9043/tcpbus/mobile?code=291', data = loginData, headers = headers, verify = False)
        rEnable = s.post('https://clientaccess.10086.cn:9043/tcpbus/mobile?code=1401', data = enableData, headers = headers, verify = False)
    except:
        print 'network error, wait 20 seconds...'
        time.sleep(20)
        seekEnableDate()
    else:
        root = ET.fromstring(rEnable.text.encode('utf8'))
        enableDate = root[0][4][1].text

    try:
        enableDate = datetime.datetime.strptime(enableDate,'%Y-%m-%d %H:%M:%S')
        enableDate = enableDate.date()
    except:
        print 'convert error, wait 10 seconds...'
        time.sleep(10)
        seekEnableDate()

    return enableDate #type:date




sim = '13455918640'
month = '06'
balance = seekBalance()
bill = seekBill()
payment = seekPayment()
enableDate = seekEnableDate()
print balance
print bill
print payment[0]
print payment[1]
print enableDate