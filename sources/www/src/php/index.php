<!DOCTYPE html>
<html lang="fr">
    <head>
        <meta charset="utf-8">
        <title>Formulaire</title>
        <link rel="stylesheet" href="style.css">

    </head>
    <header>
        <div id="Présentation">
            <h1>Titre</h1>
            <a id="" href="connexion.php">Connexion</a>
        </div>
    </header>

    <body>



        <!-- Votre Code pour l'organisation de votre page -->






        
         <?php

        //Affichage du Formulaire : Attention, ne pas supprimer les informations essentielles (username,password,adminToken)
        
        echo '<form method="POST">
            <input type="text" name="firstname" placeholder="Prénom" />
            <input type="text" name="surname" placeholder="Nom" />
            <input type="text" name="usernameSub" placeholder="Pseudo" required/>
            <input type="password" name="password" placeholder="Mot de passe" required/>
            <input type="password" name="adminToken" placeholder="Token administrateur (optionnel)"/>
            <input type="text" name="type" value="subscribe" hidden/>
            <input type="submit" value="Submit"/>
            </form>';
        
    
        
        // Comportement du script PHP une fois l'appui sur le bouton d'inscription

        if(isset($_POST["usernameSub"])){

            //Lecture du fichier de configuration
            $ini_array = parse_ini_file("config.ini");

            $name = $_POST['firstname'];
            $surname = $_POST['surname'];
            $username = $_POST['usernameSub'];      // Récupération des informations issues du formulaire
            $pwd = $_POST['password'];
            

            
            if($_POST["adminToken"]==$ini_array["ADMIN_TOKEN"]){   // Bon Token administrateur, le compte est mis en admin

                $admin=1;
            }
            elseif ($_POST["adminToken"]=="") {     // Aucun token administrateur n'est fourni, le compte n'est pas mis en admin
                $admin = 0;
            }
            else{
                echo "Mauvais Token";  // Mauvais token fournit, l'inscription n'est pas faite et un message d'erreur s'affiche    
            }

            $pwd_hash = hash('sha256', $pwd, false);  //Hachage du mot de passe par sécurité

            $token = $ini_array["PROJECT_TOKEN"];
            $projectName = $ini_array["PROJECT_NAME"];      //Lien avec la base de donnée du projet


            $postdata = http_build_query(
                array(
                    'ProjectToken' => $token,
                    'ProjectName' => $projectName,          //Données de la requête vers le microservice
                    'name' => $name,
                    'surname' => $surname,
                    'username' => $username,
                    'pwd' => $pwd_hash,
                    'admin' => $admin
                    )
            );

            

            $opts = array('http' =>
                array(
                    'method' => 'POST',
                    'header' => 'Content-type: application/x-www-form-urlencoded',      //Corps de la requête
                    'content' => $postdata
                    )
                );


                $context = stream_context_create($opts);
                if($_POST["adminToken"]==$ini_array["ADMIN_TOKEN"] or $_POST["adminToken"]==""){
                    $result = file_get_contents('https://testpack.emerginov2home.nohost.me/ms/inscription', false, $context); // On envoit la requête d'inscription au microservice

                    if($result=="Failed"){
                        echo "Cet utilisateur existe déjà";         
                    }

                    else{
                        echo "Compte créé avec succès";
                    }
                    
                }
                
        }

        ?>


            <!-- Votre Code pour l'organisation de votre page -->
        
    
    </body>
</html>
