<html>
<head>
<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<meta http-equiv="content-language" content="zh-CN" />
<title>Balance</title>
</head>
<body>

<?php

$con = mysql_connect("localhost","root","111");
if (!$con)
  {
  die('Could not connect: ' . mysql_error());
  }

mysql_select_db("longsail", $con);

//获取总记录条数
$sql = "SELECT * FROM baseinfo where current < 10 and current > 0";
$result = mysql_query($sql);
$rowNumber = mysql_num_rows($result);
mysql_free_result($result);

//指定每页显示的记录条数
$pageSize = 20;

//计算出页数
$pageCount = ceil($rowNumber / $pageSize);

//设置当前页数
$pageNum=isset($_GET['page'])?intval($_GET['page']):1;


//构造SQL语句并重新查询
$offset = ($pageNum - 1) * $pageSize;
$sql .= " limit {$offset}, {$pageSize}";
$result = mysql_query($sql);

//显示数据
echo "<h3>默认显示余额低于10元的SIM卡号</h3>";
echo "<table border='0' width = '650' cellpadding = '5' cellspacing = '1' bgcolor = '#666666'>
<tr>
<th bgcolor = '#FFFFFF'>ID</th>
<th bgcolor = '#FFFFFF'>SIM</th>
<th bgcolor = '#FFFFFF'>查询日期</th>
<th bgcolor = '#FFFFFF'>余额</th>
</tr>";

while($row = mysql_fetch_array($result))
  {
    echo "<tr>";
    echo "<td bgcolor = '#FFFFFF' align = 'center'>" . $row['id']. "</td>";
    echo "<td bgcolor = '#FFFFFF' align = 'center'>" . $row['sim'] . "</td>";
    echo "<td bgcolor = '#FFFFFF' align = 'center'>" . $row['lastcheck'] . "</td>";
    echo "<td bgcolor = '#FFFFFF' align = 'center'>" . $row['current'] . "</td>";
    echo "</tr>";
  }

echo "<tr>
<td colspan = '4' bgcolor = '#FFFFFF'>";
echo "共有" . $rowNumber ."条记录&nbsp;&nbsp;";
if ($rowNumber <= $pageSize) {
    # code...
    echo "1";
}
else {
    for ($i=1; $i <= $pageCount ; $i++) { 
        echo "<a href=\"{$_SERVER['PHP_SELF']}?page={$i}\">{$i}</a>&nbsp;&nbsp;";
    }
}
echo "</td></tr>";

echo "</table>";
mysql_close($con);
?>
</body>
</html>