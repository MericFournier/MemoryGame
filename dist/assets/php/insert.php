<?php 

include 'config.php'; 

print_r($_POST); 

$prenom = $_POST['prenom'];
$nom = $_POST['nom'];
$mail = $_POST['email'];
$phone = $_POST['phone'];
$facebook = $_POST['facebook'];
$score = $_POST['score'];
$temps = $_POST['temps'];
$coups = $_POST['coups'];
$date = date('Y-m-d H:i:s');

$prepare = $pdo->prepare('INSERT INTO data (prenom, nom, mail ,phone, score, temps, coups, facebook, date) VALUES (:prenom, :nom, :mail, :phone, :score, :temps, :coups, :facebook, :date)');
$prepare->bindValue(':prenom', $prenom);
$prepare->bindValue(':nom', $nom);
$prepare->bindValue(':mail', $mail);
$prepare->bindValue(':phone', $phone);
$prepare->bindValue(':score', $score);
$prepare->bindValue(':temps', $temps);
$prepare->bindValue(':coups', $coups);
$prepare->bindValue(':facebook', $facebook);
$prepare->bindValue(':date', $date);
$execute = $prepare->execute();
$message = $execute ? 'Enregistré' : 'Erreur';

// header("Location: ../../index.html"); 
 
