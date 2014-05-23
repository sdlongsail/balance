<!DOCTYPE html>
<html>
  <head>
    <title>show | Balance</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Bootstrap -->
    <link rel="stylesheet" href="css/bootstrap.min.css">
    <link rel="stylesheet" href="css/balance.css">
    <link rel="shortcut icon" href="favicon.ico">

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
        <script src="http://cdn.bootcss.com/html5shiv/3.7.0/html5shiv.min.js"></script>
        <script src="http://cdn.bootcss.com/respond.js/1.3.0/respond.min.js"></script>
    <![endif]-->
  </head>
  <body>
    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="http://cdn.bootcss.com/jquery/1.10.2/jquery.min.js"></script>
    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="js/bootstrap.min.js"></script>

    <?php
    //连接数据库
    $con = mysql_connect("localhost","root","111");
    if (!$con)
      {
      die('Could not connect: ' . mysql_error());
      }
    mysql_select_db("longsail", $con);

    //获取总记录条数
    $sql = "select * from baseinfo where current < 10 and current > 0 order by current";
    $result = mysql_query($sql);
    $rowNumber = mysql_num_rows($result);
    mysql_free_result($result);

    //指定每页显示的记录条数
    $pageSize = 20;

    //计算出页数
    $pageCount = ceil($rowNumber / $pageSize);

    //设置当前页数
    $pageNum=isset($_GET['page'])?intval($_GET['page']):1;


    //重新构造SQL语句并重新查询
    $offset = ($pageNum - 1) * $pageSize;
    $sql .= " limit {$offset}, {$pageSize}";
    $result = mysql_query($sql);
    ?>

    <div class="container-fluid">
    <div class="row-fluid">
        <div class="span12">
            <table class="table table-hover table-striped">
                <thead>
                    <tr>
                        <th>
                            编号
                        </th>
                        <th>
                            SIM
                        </th>
                        <th>
                            检查时间
                        </th>
                        <th>
                            余额
                        </th>
                    </tr>
                </thead>
                <tbody>
                    
                    <?php
                    while ($row = mysql_fetch_array($result)) {
                        echo "<tr class = 'success'>";
                        echo "<td>" . $row['id'] . "</td>";
                        echo "<td>" . $row['sim'] . "</td>";
                        echo "<td>" . $row['lastcheck'] . "</td>";
                        echo "<td>" . $row['current'] . "</td>";
                        echo "</tr>";
                    }
                    ?>
                    <tr>
                        <?php
                        //输出表尾
                        echo "<td colspan = '4'>共有" . $rowNumber . "条记录 &nbsp;&nbsp;<a href = 'export.php'><导出></a>&nbsp;&nbsp;";
                        if ($rowNumber <= $pageSize) {
                            echo "1";
                        }
                        else {
                            for ($i=1; $i <= $pageCount ; $i++) { 
                                echo "<a href=\"{$_SERVER['PHP_SELF']}?page={$i}\">{$i}</a>&nbsp;&nbsp;";
                            }
                            echo "<span>" . $pageNum . "/" . $pageCount . "</span>";
                        }
                        echo "</td>";
                        ?>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>

  </body>
</html>