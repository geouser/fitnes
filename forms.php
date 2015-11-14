<?php
header('Content-Type: text/html; charset=utf-8');
//#######################################################################
//##########################  Обработчик форм  ##########################
//#######################################################################

$mail_to = 'serhiyhulyi@yandex.ru';
$sms_to = '+79166090781';
$sendSMS = false;
$transliteration = flase;
$addLead = false;
								
								
//#######################################################################
// Функция отправки SMS
//#######################################################################
function sms($to, $message){
	$url =	'http://bytehand.com:3800/send?'.
			'id=17469'.
			'&key=8CCE9C9B139BF4A7'.
			'&to='.urlencode($to).
			'&from='.urlencode('UltraFitnes').
			'&text='.urlencode($message);

	$answer = @file_get_contents($url);
	if ($answer === false) {
		return false;
	} else {
		return true;
	}
}



//#######################################################################
// Функция добавления нового лида в Bitrix24 (rrent.bitrix24.ru)
//#######################################################################
function b24AddLead($data){
	$url =	'https://inwifi.bitrix24.ru/crm/configs/import/lead.php?'.
			'LOGIN='.urlencode('crm-b24@makefresh.ru').'&'.
			'PASSWORD='.urlencode('e7I4uZBjv6pilkJ6');

	foreach ($data as $key => $value) {
		if ($value !== '') {
			$url .= '&'.urlencode($key).'='.urlencode($value);
		}
	}

	$answer = @file_get_contents($url);
	$answer = str_replace("'", "\"", $answer);
	
	$resultArr = json_decode($answer, true);
	
	if ($resultArr['error'] == '201') {
		return true;
	} else {
		return false;
	}
}



//#######################################################################
// Функция транслитерации RUS -> ENG
//#######################################################################
function translit($string){
	$converter = array(
		'а' => 'a',   'б' => 'b',   'в' => 'v',
		'г' => 'g',   'д' => 'd',   'е' => 'e',
		'ё' => 'e',   'ж' => 'zh',  'з' => 'z',
		'и' => 'i',   'й' => 'y',   'к' => 'k',
		'л' => 'l',   'м' => 'm',   'н' => 'n',
		'о' => 'o',   'п' => 'p',   'р' => 'r',
		'с' => 's',   'т' => 't',   'у' => 'u',
		'ф' => 'f',   'х' => 'h',   'ц' => 'c',
		'ч' => 'ch',  'ш' => 'sh',  'щ' => 'sch',
		'ь' => '\'',  'ы' => 'y',   'ъ' => '\'',
		'э' => 'e',   'ю' => 'yu',  'я' => 'ya',

		'А' => 'A',   'Б' => 'B',   'В' => 'V',
		'Г' => 'G',   'Д' => 'D',   'Е' => 'E',
		'Ё' => 'E',   'Ж' => 'Zh',  'З' => 'Z',
		'И' => 'I',   'Й' => 'Y',   'К' => 'K',
		'Л' => 'L',   'М' => 'M',   'Н' => 'N',
		'О' => 'O',   'П' => 'P',   'Р' => 'R',
		'С' => 'S',   'Т' => 'T',   'У' => 'U',
		'Ф' => 'F',   'Х' => 'H',   'Ц' => 'C',
		'Ч' => 'Ch',  'Ш' => 'Sh',  'Щ' => 'Sch',
		'Ь' => '\'',  'Ы' => 'Y',   'Ъ' => '\'',
		'Э' => 'E',   'Ю' => 'Yu',  'Я' => 'Ya',
	);
	return strtr($string, $converter);
}



//#######################################################################
// Функция отправки почты
//#######################################################################
function custom_mail($to, $subject, $message){
	require_once('Swiftmailer/swift_required.php');

	$smtpHost			= 'smtp.yandex.ru';
	$smtpPort			= '465';
	$smtpEncryption		= 'ssl';
	$smtpUser			= 'serhiyhulyi@yandex.ru';
	$smtpPass			= 'serhiyhulyi220393';
	$XMailer			= 'SMTP Mailer v.1.0 by SSJ';
	$FromMail			= 'serhiyhulyi@yandex.ru';
	$FromName			= 'ULTRA Fitness';
	
	Swift_Preferences::getInstance()->setCharset('UTF-8');

	$transport = Swift_SmtpTransport::newInstance($smtpHost, $smtpPort)
		->setUsername($smtpUser)
		->setPassword($smtpPass);

	if (!empty($smtpEncryption)){
		$transport->setEncryption($smtpEncryption);
	}

	$mailer = Swift_Mailer::newInstance($transport);

	$msg = Swift_Message::newInstance()
				->setReturnPath($smtpUser)
				->setMaxLineLength(1000)
				->setFrom(array($FromMail => $FromName))
				->setTo(array($to))
				->setSubject($subject);
				//->setBody($message, 'text/html');


	$msg->setBody($message);
	
	$headers = $msg->getHeaders();
	$headers->addTextHeader('X-Mailer', $XMailer);


   // Подключаем плагин логов
   $logger = new Swift_Plugins_Loggers_ArrayLogger();
   $mailer->registerPlugin(new Swift_Plugins_LoggerPlugin($logger));

   $result = $mailer->send($msg, $failures);
   
    if (!$result){
		print_r(array("BAD_MAIL" => $failures, "LOG" => $logger->dump()), true);
    }
	
    return $result;
}





//=======================================================================





$id = substr(base_convert(md5(time()), 16, 10), 0, 5);

$result = array(
	'status'	=> 'error',
	'message'	=> 'Ошибка: не указан номер формы',
);

if (!empty($_POST['form_id'])) {
	
	switch ($_POST['form_id']){
		case '1':
			if (
				!empty($_POST['name'])&&
				!empty($_POST['tel'])  
			){			
				$mail_title	=	'Заявка на тест-драйв (#'.$id.')';
				$mail_text =	'Здравствуйте, на сайте была оформлена заявка тест-драйв' . "\n\n" .
								'ID: ' . $id . "\n" .
								'Дата и время заявки: ' . date('d.m.Y, H:i', time()) . "\n\n" .
								'Телефон: '.$_POST['tel'] . "\n" . 
								'Имя: '.$_POST['name'];
				
				$sms_text =		'Заявка на обратный звонок #'.$id . "\n\n" .
								'Получена ' . date('d.m.Y, H:i', time()) . "\n\n" .
								'Телефон: '.$_POST['tel'];

				$lead = array(
					'TITLE'			=> 'Заявка на обратный звонок (#'.$id.') от '.date('d.m.Y, H:i', time()),
					'PHONE_OTHER'	=> $_POST['tel'],
					'SOURCE_DESCRIPTION'	=> 'http://ultrafitnes.ru',
					'CURRENCY_ID'	=> 'RUB',
					'PRODUCT_ID'	=> 'OTHER',
					'SOURCE_ID'		=> 'WEB',
					'STATUS_ID'		=> 'NEW',
				);			

				if (custom_mail($mail_to, $mail_title, $mail_text)) {
					if ($addLead){b24AddLead($lead);}

					if ($sendSMS) {
						$sms_text = $transliteration ? translit($sms_text) : $sms_text;		
						sms($sms_to, $sms_text);
					};
					
					$result = array('status' => 'ok');
				} else {
					$result = array(
						'status'	=> 'error',
						'message'	=> 'Ошибка: не удалось отправить почтовое уведомление',
					);
				}
			}
		break;
	} // end switch
	
} // end if


header('Access-Control-Allow-Origin: *');
header('Content-type: application/json; charset=UTF-8'); 
echo json_encode($result);
?>
