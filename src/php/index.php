<?php
$postData = file_get_contents('php://input');
$data = json_decode($postData, true);

    $email = $data['email'];

   $fullname = $data['fullname'];
    $tel = $data['tel'];
    if ($email != 'err@test.ru') {
        $output['error'] = 0;
    } else {
        $output['error'] = 'Пользователь не зарегистрирован';
    }

    echo json_encode($output);

