<?php
$postData = file_get_contents('php://input');
$data = json_decode($postData, true);

$email = $data['email'];
if ($email == 'ok@test.ru') {
    $output['error'] = 0;
} else {
    $output['error'] = 'Пользователь не зарегистрирован';
}
echo json_encode($output);

