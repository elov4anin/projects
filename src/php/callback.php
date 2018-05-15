<?php
/*ini_set('display_errors', 1);
error_reporting(E_ALL);*/
// CRM server conection data
define('CRM_HOST', ''); // your CRM domain name
define('CRM_PORT', '443'); // CRM server port
define('CRM_PATH', '/crm/configs/import/lead.php'); // CRM server REST service path
// CRM server authorization data
define('CRM_LOGIN', ''); // login of a CRM user able to manage leads
define('CRM_PASSWORD', ''); // password of a CRM user
// OR you can send special authorization hash which is sent by server after first successful connection with login and password
//define('CRM_AUTH', 'HASH авторизации'); // authorization hash
/*LK server connection data*/
define('LK_HOST', ''); // your LK domain name
define('LK_PATH', ''); // path LK for post register user

if ($_POST) {
    require "../phpmailer/class.phpmailer.php";
    foreach($_POST as $k=>$v){
        if(ini_get('magic_quotes_gpc'))
          $_POST[$k]=stripslashes($_POST[$k]);

      $_POST[$k]=htmlspecialchars(strip_tags($_POST[$k]));
    }

    $name = $_POST['name'];
    $phone = $_POST['phone'];
    $email = $_POST['email'];
    $output = array();

    if(empty($name)) {$name="Не указано";}

    if(empty($phone)) {
        $output['error'] = "Введите телефон";
        echo json_encode($output);
        exit();
    } else if (!preg_match("/^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/", $phone)) {
        $output['error'] = "Некорректный номер телефона";
        echo json_encode($output);
        exit();
    }

    if (empty($email)) {
        $output['error'] = "Введите email";
        echo json_encode($output);
        exit();
    } else if (!preg_match('/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/', $email)) {
        $output['error'] = "Некорректный email адрес";
        echo json_encode($output);
        exit();
    }

  $phone =  preg_replace('/[^0-9,]/', '',substr($phone, 2));
    /* Проверка email адреса*/

    $address = "sales@ckassa.ru";
    $subject="Заявка с ЦК Провайдеры";
    $messageUser="<body style='font-family: Helvetica; font-size: 12px;'>
    <div>
        <h3 style='font-weight:400; font-family: Helvetica; font-size: 12px;'>Здравствуйте, $name!</h3>
        <p>Заявка на&nbsp;подключение сервиса принята.
         Мы&nbsp;свяжется с&nbsp;вами в&nbsp;течение рабочего дня, уточним детали подключения и&nbsp;ответим на&nbsp;все интересующие вопросы.</p>
        <p>Сейчас Вы можете:</p>
        <ul>
        <li>заполнить и&nbsp;скачать договор, используя
         <a style='font-weight:bold' href=\"https://cabinet.ckassa.ru\" target=\"_blank\">cabinet.ckassa.ru</a>;
        </li>
        <li>посетить платежную витрину -
         <a style='font-weight:bold' href=\"https://ckassa.ru/payment?utm_source=respletter\" target=\"_blank\">ckassa.ru;</a>
        </li>
        <li>
        <a style='font-weight:bold' href=\"https://app.ckassa.ru/mobile/?utm_source=respletter\" target=\"_blank\">установить&nbsp;приложение</a>
         для&nbsp;iOS и&nbsp;android;
        </li>
        <li>ознакомиться с&nbsp;новостями платежного сервиса в&nbsp;группе
         <a style='font-weight:bold' href=\"https://vk.com/ckassa\" target=\"_blank\">ВКонтакте</a>;
        </li>
        </ul>
        <p>Центральная касса<br/>Все платежи вовремя</p>
    </div>
    </body>";

// get lead data from the form
    $postData = array(
        'TITLE' => "Заявка с ЦК Такси",
        'NAME' => $name,
        'PHONE_WORK' => $phone,
        'EMAIL_WORK' => $email,
        'SOURCE_ID' => 17,
        'ASSIGNED_BY_ID' => 45,
        'STATUS_ID' => 16
    );

    // append authorization data
    if (defined('CRM_AUTH')) {
        $postData['AUTH'] = CRM_AUTH;
    } else {
        $postData['LOGIN'] = CRM_LOGIN;
        $postData['PASSWORD'] = CRM_PASSWORD;
    }

    // open socket to CRM
    $fp = fsockopen("ssl://" . CRM_HOST, CRM_PORT, $errno, $errstr, 30);
    if ($fp) {
        // prepare POST data
        $boundary = sha1(1);
        $crlf = "\r\n";
        $body = '';
        foreach ($postData as $key => $value) {
            $body .= '--' . $boundary . $crlf
                . 'Content-Disposition: form-data; name="' . $key . '"' . $crlf
                . 'Content-Length: ' . strlen($value) . $crlf . $crlf
                . $value . $crlf;
        }

        $write = "POST " . CRM_PATH . " HTTP/1.1\r\n"
            . "Host: " . CRM_HOST . "\r\n"
            . "Content-type: multipart/form-data; boundary=" . $boundary . "\r\n"
            . "Content-Length: " . strlen($body) . "\r\n"
            . "Connection: Close\r\n\r\n"
            . $body;

        // send POST to CRM
        fwrite($fp, $write);

        // get CRM headers
        $result = '';
        while (!feof($fp)) {
            $result .= fgets($fp, 128);
        }
        fclose($fp);

        // cut response headers
        $response = explode("\r\n\r\n", $result);

        $json = json_decode(str_replace("'", "\"", $response[1]));

        if ($json->error != '201') {
            $output['error'] = "Сообщение не может быть отправлено!";//'Failed to add lead: ' . $json->error_message . '(' . $json->error . ')';
        } else {
            $output['error'] = 0;

            $companyMail = new PHPMailer();
            $companyMail->IsMail();
            $companyMail->AddAddress($email);
            $companyMail->Sender = $address;
            $companyMail->From = $address;
            $companyMail->FromName = 'ООО «Центральная касса»';
            $companyMail->Subject = 'Ваша заявка принята';
            $companyMail->Body = $messageUser;
            $companyMail->IsHtml(true);
          /*  $companyMail->Send(); */  /*Отключить отправку письма*/
        }

    } else {
        $output['error'] = "Сообщение не может быть отправлено!";//'Connection Failed! ' . $errstr . ' (' . $errno . ')';
    }

    echo json_encode($output);


  // pull to LK
  $query = LK_HOST.LK_PATH.'email='.urlencode($email).'&name='.urlencode($name).'&phone='.urlencode($phone).'&source_id=4&send_email=yes&tariffs=TAXI_PA_REFILL_SUPER,TAXI_PA_REFILL_OPTIMAL,TAXI_PA_REFILL_BASE,TAXI_CK_REFILL_BASE,TAXI_CK_REFILL_OPTIMAL,TAXI_CK_REFILL_SUPER,CK_PO_TAXI_MASTER,PA_PO_TAXI_MASTER';
  file_get_contents($query);
}
?>
