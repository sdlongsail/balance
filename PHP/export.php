<?php
//连接数据库
$con = mysql_connect("localhost","root","111");
if (!$con)
  {
  die('Could not connect: ' . mysql_error());
  }
mysql_select_db("longsail", $con);

//获取记录
$sql = "select * from baseinfo where current < 10 and current > 0 order by current";
$result = mysql_query($sql);

$title = "SIM,检查时间,余额\n";
$str = iconv("utf-8", "gb2312", $title);

while ($row = mysql_fetch_array($result)) {
    # code...
    $id = iconv("utf-8", "gb2312", $row['id']);
    $sim = iconv("utf-8", "gb2312", $row['sim']);
    $lastcheck = iconv("utf-8", "gb2312", $row['lastcheck']);
    $current = iconv("utf-8", "gb2312", $row['current']);
    $str .= $sim . "," . $lastcheck . "," . $current. "\n";
}
$filename = date('Y-m-d') . '资费明细.csv';
export_csv($filename, $str);


function export_csv($filename, $data)
{
    header("Content-type:text/csv");
    header("Content-Disposition:attachment;filename=" . $filename);
    header("Cache-Control:must-revalidate,post-check=0,pre-check=0");
    header("Expires:0");
    header("Pragma:public");
    echo "$data";
}

?>
