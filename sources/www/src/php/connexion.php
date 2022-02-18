<?php 
	session_start(); // Démarrage de la session
?>

<!doctype html>
<html>
<head>
</head>

<body>

<?php

	//Fonction définissant le contenu à afficher dans le cas d'un utilisateur non connecté



	function dumpLogginForm(){

	?>

		
		<!-- Votre Code  HTML pour l'organisation de votre page de connexion -->


   <?php

		//Formulaire de connexion
		echo 	'<form method="POST">
					<input type="text" name="username" placeholder="Pseudo" required/>
					<input type="password" name="password" placeholder="Mot de passe" required/>   
					<input type="text" name="type" value="connect" hidden/>
					<input type="submit" value="Connection"/>
				</form>';	

	?>


		

			<!-- Votre Code  HTML pour l'organisation de votre page de connexion -->






	<?php

			
	}

	//==========================================================================================================================================//




	//Fonction définissant le contenu à afficher dans le cas d'un utilisateur connecté

	function dumpUnlogginForm(){

		//Bouton de deconnexion

	?>

		
		 <!-- Votre Code  HTML pour l'organisation de votre page après connexion -->


	<?php

		//Bouton déconnexion à personnaliser
		echo 	'<form method="POST">
          				<input type="submit" value="Deconnexion!" name="unlogg">     
				</form>';	

	
	?>

		
		 <!-- Votre Code  HTML pour l'organisation de votre page après connexion -->




	<?php
	}

	//==========================================================================================================================================//



	$ini_array = parse_ini_file("config.ini"); // Lecture du fichier de configuration


	if (!isset($_SESSION['logged']) || !$_SESSION['logged']) {   //l'utilisateur n'est pas connecté
		
  		if( isset($_POST['username']) ){     //Cas où l'utlisateur envoie une requête de connexion

			$postdata = http_build_query(
				array(
					'ProjectToken' => $ini_array["PROJECT_TOKEN"],
					'ProjectName' => $ini_array["PROJECT_NAME"],			// Récupération des informations issues du formulaire
					'username' => $_POST["username"],
					'pwd' => hash('sha256', $_POST["password"], false)
					)
			);
			$opts = array('http' =>
				array(
					'method' => 'POST',
					'header' => 'Content-type: application/x-www-form-urlencoded',		//Coprs de la requête
					'content' => $postdata
					)
			);
			
			$context = stream_context_create($opts);
			$result = file_get_contents('https://testpack.emerginov2home.nohost.me/ms/connection', false, $context);   // On envoit la requête d'inscription au microservice
			

			if($result=="User not found"){	//Si mauvaise combinaison user/mdp on affiche le formulaire de connexion et un message d'erreur
				dumpLogginForm();
				echo "pseudo ou mot de passe érroné";
			}

			else{	//Si la connexion réussit
				$_SESSION['user'] = json_decode($result);
				echo "Bienvenue {$_SESSION['user']->firstnaname} {$_SESSION['user']->surname}"; //L'objet $_SESSION['user'] contient les informations de l'utilisateur connecté (notamment si il est admin)	
				$_SESSION['logged'] = true; // On voit ici l'objet session qui peut stocker des information
			}

		}
		
		else {	
			dumpLogginForm();
		}	 	
	} 

	if(isset($_SESSION['logged']) && $_SESSION['logged']){  //l'utilisateur est connecté (peut être après modification par les expressions précédentes)

		if( isset($_POST['unlogg']) ){ 
			$_SESSION['logged'] = false;   //Cas où l'utilisateur s'est déconnecté
			$_SESSION['user'] = NULL;
			dumpLogginForm();
		} else {
			dumpUnlogginForm();		//Cas où l'utilisateur ne s'est pas déconnecté
		}
	}

?>

</body>
</html>

