-- Extension des parcours jeunes avec de nouveaux thèmes adaptés à l'âge.
-- À exécuter après schema.sql et seed-learning-content.sql dans Supabase > SQL Editor.
-- Ce script est idempotent : une nouvelle exécution met à jour les modules ajoutés.

do $seed$
declare
  activity jsonb;
  v_track_id uuid;
  v_module_id uuid;
  v_next_order smallint;
begin
  for activity in
    select value from jsonb_array_elements($payload$[
      {"age_min":6,"title":"Les cadeaux gratuits, ça existe ?","tag":"PUBLICITÉS ET JEUX","icon":"🎁","level":"Découverte","description":"Reconnaître une publicité et demander conseil avant de cliquer sur une offre.","duration":"5 min","lesson":["Dans un jeu ou une vidéo, une image peut essayer de te faire acheter quelque chose.","Un gros bouton coloré ou une promesse de cadeau peut être une publicité.","Si une offre te demande de cliquer ou d'écrire ton nom, demande à un adulte avant de continuer."],"question":"Un jeu annonce un cadeau si tu cliques vite et écris ton prénom. Que fais-tu ?","options":["Je clique tout de suite pour ne pas rater le cadeau.","Je demande à un adulte de regarder avec moi avant de cliquer.","J'écris le prénom d'un ami."],"correct":1,"explanation":"Tu peux prendre ton temps et demander de l'aide. Une offre qui presse n'est pas forcément sûre."},
      {"age_min":6,"title":"Des mots qui font du bien","tag":"BIEN VIVRE EN LIGNE","icon":"💛","level":"Découverte","description":"Choisir des mots gentils et savoir quoi faire quand un message blesse.","duration":"5 min","lesson":["Derrière un écran, il y a une vraie personne avec des émotions.","Avant d'envoyer un message, demande-toi s'il est gentil et respectueux.","Si un message te rend triste, tu peux arrêter la conversation et en parler à un adulte de confiance."],"question":"Dans un jeu, quelqu'un se moque d'un autre enfant. Quel est le meilleur réflexe ?","options":["Je me moque aussi pour faire rire le groupe.","Je n'ajoute pas de moquerie et j'en parle à un adulte si cela continue.","Je partage le message partout."],"correct":1,"explanation":"Ne pas amplifier la moquerie et demander de l'aide protège les enfants concernés."},
      {"age_min":6,"title":"Je crée avec mon imagination","tag":"CRÉATION NUMÉRIQUE","icon":"🎨","level":"Intermédiaire","description":"Créer une histoire ou un dessin numérique en respectant les autres.","duration":"6 min","lesson":["Une tablette peut servir à inventer une histoire, dessiner ou enregistrer sa voix.","Avant de publier une photo ou une création où apparaît quelqu'un, il faut demander son accord.","Garde les informations privées hors de ton dessin ou de ton histoire : adresse, école et numéro."],"question":"Tu veux publier un dessin où l'on voit ton ami et le nom de son école. Que fais-tu ?","options":["Je le publie, c'est seulement un dessin.","Je demande son accord et je retire le nom de l'école.","Je donne aussi son adresse pour expliquer le dessin."],"correct":1,"explanation":"Demander l'accord et protéger les informations personnelles sont de bons réflexes, même dans une création."},
      {"age_min":6,"title":"Quand une image me gêne","tag":"DEMANDER DE L'AIDE","icon":"🫶","level":"Découverte","description":"Savoir s'arrêter et trouver un adulte de confiance face à un contenu inquiétant.","duration":"4 min","lesson":["Tu n'as pas besoin de rester devant une image qui te fait peur ou te met mal à l'aise.","Tu peux fermer la vidéo, poser l'appareil et rejoindre un adulte de confiance.","Tu n'es pas en faute si tu as vu quelque chose de dérangeant. Tu as le droit d'être aidé·e."],"question":"Une vidéo montre quelque chose qui te fait peur. Que fais-tu ?","options":["Je regarde jusqu'à la fin sans rien dire.","Je ferme la vidéo et je vais en parler à un adulte.","Je l'envoie à un autre enfant."],"correct":1,"explanation":"Tu peux arrêter et demander de l'aide. Tu n'as pas à gérer cela seul·e."},
      {"age_min":9,"title":"Le lien qui veut aller trop vite","tag":"HAMEÇONNAGE","icon":"🪝","level":"Intermédiaire","description":"Repérer un message pressant qui cherche à récupérer un mot de passe.","duration":"7 min","lesson":["Un faux message peut ressembler à celui d'un jeu ou d'un service connu.","Les menaces de fermeture et les cadeaux urgents poussent à cliquer sans réfléchir.","Ouvre le service par son application habituelle et demande conseil avant de saisir un mot de passe."],"question":"Un message dit que ton compte sera fermé dans 5 minutes et demande ton mot de passe. Que fais-tu ?","options":["Je clique vite pour sauver mon compte.","Je ne réponds pas et je vérifie avec un adulte ou l'application officielle.","J'envoie le message à tous mes amis."],"correct":1,"explanation":"L'urgence est souvent un piège. Vérifie le message par un canal officiel et ne partage jamais ton mot de passe."},
      {"age_min":9,"title":"Réagir au cyberharcèlement","tag":"RESPECT EN LIGNE","icon":"🤝","level":"Intermédiaire","description":"Soutenir un camarade sans partager ni amplifier un contenu humiliant.","duration":"8 min","lesson":["Des messages répétés qui humilient ou menacent peuvent faire beaucoup de mal.","Ne transfère pas les contenus blessants : cela augmente leur diffusion.","Soutiens la personne, garde une preuve sans la publier et préviens un adulte de confiance."],"question":"Une photo humiliante d'un camarade circule dans un groupe. Comment l'aider ?","options":["Je la transfère pour demander l'avis des autres.","Je ne la partage pas, je soutiens mon camarade et j'en parle à un adulte.","Je réponds par une autre photo humiliante."],"correct":1,"explanation":"Ne pas partager, soutenir la personne et alerter un adulte aide à arrêter la diffusion."},
      {"age_min":9,"title":"Avant de partager une photo","tag":"CONSENTEMENT","icon":"📸","level":"Découverte","description":"Demander l'accord des personnes et vérifier les détails visibles sur une photo.","duration":"6 min","lesson":["Une photo peut montrer un visage, un uniforme, une adresse ou le lieu où l'on se trouve.","Demande l'accord des personnes avant de publier une image où elles apparaissent.","Même dans un groupe privé, une image peut être copiée ou envoyée ailleurs."],"question":"Tu veux poster une photo de ton équipe à l'école. Quel réflexe adopter ?","options":["Je la publie, le groupe est privé.","Je demande l'accord des personnes et je vérifie qu'aucune information sensible n'apparaît.","Je publie seulement si la photo est jolie."],"correct":1,"explanation":"L'accord des personnes et les informations visibles comptent, même dans un groupe privé."},
      {"age_min":9,"title":"Pourquoi cette vidéo apparaît ?","tag":"ALGORITHMES","icon":"🔁","level":"Expert","description":"Comprendre que les recommandations sont choisies automatiquement et peuvent enfermer dans une boucle.","duration":"7 min","lesson":["Une application observe les contenus que tu regardes et peut en proposer d'autres semblables.","Une recommandation n'est pas forcément la meilleure information ni le meilleur choix pour toi.","Tu peux faire une pause, changer de sujet et parler à un adulte si l'application te met mal à l'aise."],"question":"Après une vidéo, l'application en propose beaucoup d'autres sur le même sujet. Que peux-tu faire ?","options":["Penser que l'application sait toujours ce qui est bon pour moi.","Choisir moi-même, faire une pause et vérifier les informations importantes.","Regarder sans limite pour ne pas manquer la suite."],"correct":1,"explanation":"Les recommandations sont automatiques. Tu peux reprendre le contrôle de ton temps et de tes choix."},
      {"age_min":12,"title":"Pourquoi mon fil me connaît si bien ?","tag":"ALGORITHMES ET ATTENTION","icon":"🧠","level":"Expert","description":"Comprendre les recommandations personnalisées et reprendre le contrôle de son fil.","duration":"8 min","lesson":["Les plateformes utilisent souvent tes vues, clics et réactions pour choisir ce qu'elles te montrent.","Un fil personnalisé peut être pratique, mais il ne représente pas toute la réalité.","Tu peux modifier tes abonnements, masquer des sujets et choisir des sources différentes."],"question":"Ton fil ne montre presque plus qu'un seul point de vue. Quel réflexe est utile ?","options":["Croire que tout le monde pense pareil.","Chercher volontairement des sources fiables et des points de vue différents.","Partager les publications sans les lire."],"correct":1,"explanation":"Comparer des sources diverses aide à garder du recul sur un fil personnalisé."},
      {"age_min":12,"title":"Une image peut-elle mentir ?","tag":"VÉRIFICATION DE L'INFORMATION","icon":"🕵🏾","level":"Expert","description":"Vérifier le contexte, la date et la source originale d'une image virale.","duration":"9 min","lesson":["Une image réelle peut être ancienne, recadrée ou associée à un événement différent.","Cherche la publication originale, la date et le lieu avant de conclure.","Compare avec des sources identifiables et évite de repartager une image si tu ne peux pas la vérifier."],"question":"Une image spectaculaire circule avec un titre alarmant mais sans date. Que faire ?","options":["La repartager pour prévenir tout le monde.","Chercher son origine et son contexte auprès de plusieurs sources fiables.","Croire le titre si beaucoup de personnes l'ont partagé."],"correct":1,"explanation":"Le nombre de partages ne prouve pas qu'une image est récente ou correctement présentée."},
      {"age_min":12,"title":"Mon identité numérique, mes choix","tag":"IDENTITÉ NUMÉRIQUE","icon":"🪪","level":"Intermédiaire","description":"Construire une présence en ligne qui respecte ses limites et son avenir.","duration":"8 min","lesson":["Les commentaires, photos et profils contribuent à l'image que les autres se font de toi.","Les paramètres privés réduisent l'audience, mais ne garantissent pas qu'un contenu ne sera jamais copié.","Avant une publication, pense aux personnes qui peuvent la voir aujourd'hui et plus tard."],"question":"Tu hésites à publier une blague qui vise un camarade. Que vérifier ?","options":["La publier si elle fait rire mes amis.","Penser à son impact, respecter la personne et choisir de ne pas publier si cela peut la blesser.","La poster anonymement."],"correct":1,"explanation":"L'anonymat n'efface pas l'impact. Le respect et le consentement restent essentiels en ligne."},
      {"age_min":12,"title":"L'IA répond, mais a-t-elle raison ?","tag":"INTELLIGENCE ARTIFICIELLE","icon":"✨","level":"Expert","description":"Utiliser une réponse générée comme point de départ et vérifier les faits importants.","duration":"9 min","lesson":["Une IA peut produire une réponse fluide tout en se trompant ou en inventant une source.","Vérifie les faits dans des ressources fiables avant de les utiliser pour un devoir ou une décision.","Ne donne pas à un outil d'IA des mots de passe, des photos privées ou des informations sensibles."],"question":"Une IA donne une statistique étonnante sans source vérifiable. Que faire ?","options":["La reprendre parce que la réponse paraît sûre.","Chercher une source fiable indépendante et ne pas partager de données personnelles.","Demander à la même IA de confirmer qu'elle a raison."],"correct":1,"explanation":"Une réponse convaincante n'est pas une preuve. Vérifie ailleurs et protège tes données."}
    ]$payload$::jsonb)
  loop
    select t.id into v_track_id
    from public.learning_tracks as t
    where t.age_min = (activity ->> 'age_min')::smallint and t.age_max = case (activity ->> 'age_min')::smallint
      when 6 then 8 when 9 then 11 when 12 then 15 else 18 end
      and t.status = 'published'
    order by t.sort_order limit 1;

    if v_track_id is null then
      raise notice 'Parcours %–% ans introuvable : % ignoré', activity ->> 'age_min', case (activity ->> 'age_min')::smallint when 6 then 8 when 9 then 11 when 12 then 15 else 18 end, activity ->> 'title';
      continue;
    end if;

    select m.id into v_module_id
    from public.modules as m
    where m.track_id = v_track_id and m.title = activity ->> 'title'
    limit 1;
    if v_module_id is null then
      select coalesce(max(m.sort_order), 0) + 1 into v_next_order
      from public.modules as m where m.track_id = v_track_id;
      insert into public.modules(track_id, title, summary, content, estimated_minutes, sort_order, status)
      values(v_track_id, activity ->> 'title', activity ->> 'description', activity,
        (regexp_replace(activity ->> 'duration', '[^0-9]', '', 'g'))::smallint, v_next_order, 'published');
    else
      update public.modules set summary = activity ->> 'description', content = activity,
        estimated_minutes = (regexp_replace(activity ->> 'duration', '[^0-9]', '', 'g'))::smallint,
        status = 'published'
      where id = v_module_id;
    end if;
    v_module_id := null;
    v_track_id := null;
  end loop;
end
$seed$;

select t.title, count(m.id) as modules_publies
from public.learning_tracks t
left join public.modules m on m.track_id = t.id and m.status = 'published'
where t.status = 'published'
group by t.id, t.title, t.age_min
order by t.age_min;
