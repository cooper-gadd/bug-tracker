-- Create databases on Solace, only tables
USE ctg7866;

DROP TABLE IF EXISTS bugs;
DROP TABLE IF EXISTS user_details;
DROP TABLE IF EXISTS bug_status;
DROP TABLE IF EXISTS priority;
DROP TABLE IF EXISTS role;
DROP TABLE IF EXISTS project;

CREATE TABLE project
(
 Id INT NOT NULL AUTO_INCREMENT,
 Project CHAR(50) NOT NULL,
 PRIMARY KEY(Id)
) ENGINE=InnoDB;
INSERT INTO project (Project) values ('Zed'),('Cursor'),('Neovim'),('VSCode'),('Intellji');

CREATE TABLE role
(
 Id INT NOT NULL AUTO_INCREMENT,
 Role VARCHAR(50) NOT NULL,
 PRIMARY KEY(Id)
) ENGINE=InnoDB;
INSERT INTO role (Role) values ('Admin'),('Manager'),('User');

CREATE TABLE user_details
(
 Id INT NOT NULL AUTO_INCREMENT,
 Username CHAR(50) NOT NULL,
 RoleID INT NOT NULL,
 ProjectId INT NULL, -- manager and admin are null
 Password VARCHAR(100), -- must be hashed
 Name VARCHAR(250) NOT NULL,
 PRIMARY KEY(Id),
 KEY `fk_role` (`RoleId`),
 KEY `fk_project_assigned` (`ProjectId`),
 CONSTRAINT `fk_role` FOREIGN KEY (`RoleId`) REFERENCES `role` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
 CONSTRAINT `fk_project_assigned` FOREIGN KEY (`ProjectId`) REFERENCES `project` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB;
INSERT INTO user_details (Username, RoleID, ProjectId, Password, Name) VALUES
('Steve.Jobs', 3, 1, 'password', 'Steve Jobs'),
('Elon.Musk', 3, 1, 'password', 'Elon Musk'),
('Bill.Gates', 3, 1, 'password', 'Bill Gates'),
('Mark.Zuckerberg', 3, 2, 'password', 'Mark Zuckerberg'),
('Jeff.Bezos', 3, 2, 'password', 'Jeff Bezos'),
('Larry.Page', 3, 2, 'password', 'Larry Page'),
('Sergey.Brin', 3, 3, 'password', 'Sergey Brin'),
('Tim.Cook', 3, 3, 'password', 'Tim Cook'),
('Satya.Nadella', 3, 4, 'password', 'Satya Nadella'),
('Sundar.Pichai', 3, 4, 'password', 'Sundar Pichai'),
('Jack.Dorsey', 3, 4, 'password', 'Jack Dorsey'),
('Reed.Hastings', 3, 5, 'password', 'Reed Hastings'),
('Susan.Wojcicki', 3, 5, 'password', 'Susan Wojcicki'),
('Sheryl.Sandberg', 3, 5, 'password', 'Sheryl Sandberg'),
('Marissa.Mayer', 2, NULL, 'password', 'Marissa Mayer'),
('Meg.Whitman', 2, NULL, 'password', 'Meg Whitman'),
('Michael.Dell', 2, NULL, 'password', 'Michael Dell'),
('Jensen.Huang', 1, NULL, 'password', 'Jensen Huang'),
('Marc.Benioff', 1, NULL, 'password', 'Marc Benioff'),
('Sam.Altman', 1, NULL, 'password', 'Sam Altman');

CREATE TABLE bug_status
(
 Id INT NOT NULL AUTO_INCREMENT,
 Status CHAR(50) NOT NULL,
 PRIMARY KEY(Id)
);
INSERT INTO bug_status (Status) VALUES ('Unassigned'), ('Assigned'), ('Closed');

CREATE TABLE priority
(
 Id INT NOT NULL AUTO_INCREMENT,
 Priority VARCHAR(10) NOT NULL,
 PRIMARY KEY(Id)
);
INSERT INTO priority (Priority) VALUES ('Low'), ('Medium'), ('High'),('Urgent');

CREATE TABLE `bugs` (
 `id` INT NOT NULL AUTO_INCREMENT,
 `projectId` INT NOT NULL,
 `ownerId` INT NOT NULL,
 `assignedToId` INT NULL,
 `statusId` INT NOT NULL,
 `priorityId` INT NOT NULL,
 `summary` VARCHAR(250) NOT NULL,
 `description` VARCHAR(2500) NOT NULL,
 `fixDescription` VARCHAR(2500) DEFAULT NULL,
 `dateRaised` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 `targetDate` timestamp NULL DEFAULT NULL,
 `dateClosed` timestamp NULL DEFAULT NULL,
 PRIMARY KEY (`id`),
 KEY `fk_project` (`projectId`),
 KEY `fk_owner` (`ownerId`),
 KEY `fk_assigned` (`assignedToId`),
 KEY `fk_status` (`statusId`),
 KEY `fk_priority` (`priorityId`),
 CONSTRAINT `fk_project` FOREIGN KEY (`projectId`) REFERENCES `project` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
 CONSTRAINT `fk_owner` FOREIGN KEY (`ownerId`) REFERENCES `user_details` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
 CONSTRAINT `fk_assigned` FOREIGN KEY (`assignedToId`) REFERENCES `user_details` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
 CONSTRAINT `fk_status` FOREIGN KEY (`statusId`) REFERENCES `bug_status` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
 CONSTRAINT `fk_priority` FOREIGN KEY (`priorityId`) REFERENCES `priority` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO bugs (projectId, ownerId, assignedToId, statusId, priorityId, summary, description, fixDescription, dateRaised, targetDate, dateClosed) VALUES
('1', '1', null, '1', '1', 'Aperiam patior ventosus arx supellex facere ubi adfectus.', 'Laudantium facilis cogo vulticulus tergum attollo. Harum adsuesco demergo decor adversus arbor denique antea. Uberrime vapulus spargo caecus deleniti triumphus.', 'Angelus voco canonicus arbitro aurum subvenio eveniet subvenio. Ullus surculus constans cilicium credo sollicito. Utroque ambitus vox thesaurus earum appello deserunt.', '2023-10-30T07:01:07', null, null),
('1', '2', null, '1', '2', 'Avaritia amitto ascisco adopto abeo uter conservo contabesco.', 'Somniculosus aspicio corrigo solus timidus. Utique cauda coma concido terreo audeo curto infit tonsor non. Aequitas voveo usus dignissimos fuga conscendo tutis video suppono constans.', null, '2023-11-02T02:24:35', null, '2024-06-20T04:12:42'),
('1', '3', null, '1', '3', 'Vix unus synagoga universe tabula abundans volutabrum.', 'Synagoga vulgivagus concedo depereo advoco allatus ter. Ad deprecator coruscus deprimo carcer addo. Campana solium comitatus thesis amicitia magnam vilitas crinis.', 'Audax vereor truculenter terminatio neque necessitatibus colligo denique assumenda thema. Cresco porro similique defetiscor stillicidium decet crapula. Carbo adaugeo despecto caveo vigilo ventito beatae.', '2023-05-01T00:07:14', '2024-10-12T03:11:54', null),
('1', '15', '1', '2', '4', 'Amoveo curis similique suppellex varietas subvenio laborum quaerat conatus depono.', 'Adimpleo cunctatio strenuus pecto nostrum decimus. Vita vel deleo. Enim fuga pectus abutor suffoco defero demum compono.', 'Adhaero cauda commodo canto sperno somniculosus. Stipes numquam strenuus sonitus triumphus trucido dapifer cultellus terra tener. Volo clementia utpote carcer eligendi quam.', '2023-03-19T13:43:02', null, null),
('1', '15', '2', '2', '1', 'Decerno tui territo taedium iusto confugo xiphias desolo.', 'Uberrime umbra arto urbanus adipisci certe in. Debeo conforto cinis caste praesentium. Damno cena suggero terra arma.', 'Currus aggredior explicabo cupiditas somniculosus cupio ambitus. Vicinus maiores iure claro angustus una corroboro. Conitor colligo excepturi ciminatio.', '2023-09-01T08:15:38', null, '2023-06-22T20:37:32'),
('1', '16', '3', '2', '2', 'Alius soluta coruscus sunt.', 'Verecundia vigilo vito officia. Quidem coniecto ambulo autus deleo toties. Suffragium utique suppellex neque corrigo.', null, '2023-03-14T13:50:51', null, null),
('1', '16', '1', '2', '3', 'Officia rem contego adicio avaritia strenuus blandior cetera coniecto.', 'Constans certe aufero culpo illum ex tametsi tertius. Adulatio voveo expedita cado laboriosam arca voco conitor. Concedo aperio compono communis theatrum totus attollo tibi alii spiculum.', null, '2024-03-04T19:43:43', '2024-10-12T00:44:27', '2023-05-19T01:59:23'),
('1', '17', '2', '2', '4', 'Conturbo cena magnam suus uberrime aegrus.', 'Crux alienus admiratio commodo. Succurro vesco carmen ager. Expedita beatae vomito cotidie acsi spargo bonus amitto attero.', null, '2023-02-05T23:22:18', null, null),
('1', '17', '3', '2', '1', 'Quam celebrer cupiditas carcer.', 'Quidem modi adfectus caecus. Vado contigo desolo id arcesso spectaculum utrimque. Clementia ventito centum molestias cruentus acervus benevolentia eveniet.', null, '2023-06-29T06:57:28', null, null),
('1', '18', '1', '3', '2', 'Solitudo curtus unde deripio vinculum ascit veniam adhaero aer.', 'Alter aut celer ancilla adversus avarus damno volaticus vereor tamquam. Conicio canis substantia hic demonstro decumbo. Tantum abeo claustrum nulla.', null, '2023-08-04T18:11:34', null, null),
('2', '4', null, '1', '3', 'Stella aperiam tubineus totidem commodo considero.', 'Ara in necessitatibus dolores tui praesentium amplitudo volup civis. Esse circumvenio tamdiu degenero tergeo assumenda colo. Testimonium fugiat substantia bos succedo.', 'Patria crebro cuppedia. Abbas absconditus nihil amet acies pel teres thorax color. Tergo quisquam cultellus sono congregatio clam magnam cetera cetera talio.', '2023-10-03T11:17:12', null, null),
('2', '5', null, '1', '4', 'Cogito cultura volo dens.', 'Explicabo canonicus dolor deorsum caveo termes amplexus. Minus ultio officia subnecto ager astrum. Textor clarus sulum thermae cohaero adipiscor tenuis quia tempore dolores.', 'Adiuvo cedo carpo inflammatio charisma aufero. Degero ocer compello absorbeo. Uter annus pel capillus.', '2023-05-19T06:54:40', null, null),
('2', '6', null, '1', '1', 'Tempus coaegresco victoria acidus deduco crapula.', 'Alius minima suadeo corpus. Delectus quisquam subiungo. Volo cohors attero voluntarius vetus custodia.', null, '2024-06-20T01:39:47', '2024-12-15T18:36:17', '2024-01-13T11:14:44'),
('2', '15', '4', '2', '2', 'Censura terra fugit sursum adeo.', 'Voco depromo vespillo cervus aranea. Adimpleo stipes aliqua sulum angulus vitae ullus anser. Comes coaegresco assentator utilis.', null, '2024-05-19T19:59:44', '2024-12-14T08:42:28', '2023-10-31T10:32:55'),
('2', '15', '5', '2', '3', 'Defetiscor vinum creator articulus.', 'Apto magni blanditiis paens cerno coniuratio conculco rem. Capto uberrime corpus ullus assentator stella adulescens vado vaco sono. Quis tergiversatio tendo.', 'Accendo compello bene blanditiis tero caveo candidus copiose repudiandae. Culpa vesper depopulo. Conduco magni temeritas arcus verumtamen.', '2023-12-03T17:13:43', '2024-11-15T16:33:33', null),
('2', '16', '6', '2', '4', 'Debeo attero pax bellicus animi accedo cena communis.', 'Acidus desolo tremo absens defungo expedita beatae defessus timor vinitor. Comitatus ait capillus consectetur aurum voluptatum sumptus. Speciosus taedium derideo.', 'Tum nihil thesaurus usus ullam cogo degusto studio decerno. Cibus decipio pax decumbo ventito nesciunt candidus trucido cresco voro. Vaco virgo cenaculum comitatus apud arbitro audacia crastinus adiuvo.', '2024-09-28T23:21:22', null, null),
('2', '16', '4', '2', '1', 'Umbra confugo comburo tremo.', 'Ipsum crebro curo sursum stipes iste stillicidium taedium ulterius valeo. Viriliter vulticulus sint cogito valens aurum decumbo. Desidero titulus thermae vulpes volup vulpes natus tabernus doloremque.', null, '2024-04-23T22:44:07', null, null),
('2', '17', '5', '2', '2', 'Cervus basium tollo desolo.', 'Sollicito tamen voluptatem voluntarius virga umquam cognatus torrens demonstro acies. Demulceo odio subiungo tutis tubineus suggero stips bis audeo. Vos tamisium ara clarus deludo pariatur bos sulum.', 'Iure cruciamentum totidem. Tabgo volubilis depereo venia. Exercitationem accendo viduo decimus doloremque veritas stillicidium astrum consequatur praesentium.', '2024-05-29T00:25:17', '2024-12-01T14:06:47', '2023-01-07T21:10:02'),
('2', '17', '6', '2', '3', 'Averto virga tolero bellicus arbor deporto corrupti.', 'Speciosus creo absum. Illum vinitor versus commodi arcesso advenio addo casso modi clementia. Acerbitas optio cogo argumentum ultra tredecim titulus tui.', null, '2023-06-01T01:11:33', null, '2023-01-23T18:07:42'),
('2', '19', '4', '3', '4', 'Repellat audacia amissio abundans benigne incidunt.', 'Accedo demo complectus demonstro antepono spiritus denuncio earum sono crux. Colo repellendus vir civitas clamo cunctatio vespillo tener. Claustrum mollitia varietas cogo alias convoco qui causa spargo.', 'Stultus traho depraedor comburo via depulso culpo. Cubitum tantum tabula arceo tempus vox argentum. Degusto comptus curvo barba illo tubineus anser maxime.', '2023-12-26T10:03:26', null, '2023-03-24T20:50:45'),
('3', '7', null, '1', '1', 'Trepide vulpes adfero claro.', 'Thymbra ascisco vacuus arbitro thesis. Ars canis cetera conventus tabella porro vesica esse cur cumque. Thesaurus arbitro sufficio demulceo.', 'Demulceo viscus tremo voluptas apto. Defessus alias vulticulus distinctio acervus ambitus claro. Necessitatibus conor despecto apparatus artificiose theologus.', '2023-11-13T03:32:06', '2024-11-14T21:59:00', '2023-09-27T22:39:14'),
('3', '8', null, '1', '2', 'Turpis magnam cornu thema calculus thalassinus quo attonbitus torqueo.', 'Adhuc tibi articulus aiunt abstergo vix nam facilis auditor spero. Tristis labore caecus tres corporis. Supra vestigium paulatim.', null, '2023-02-11T20:05:33', '2024-10-15T20:37:49', null),
('3', '15', '7', '2', '3', 'Spectaculum somniculosus magnam tubineus crux solium.', 'Abbas nemo aduro defero velociter. Amaritudo victus patria perspiciatis cuius strues ad. Urbs calco consuasor angulus decet cuppedia angulus aetas.', 'Unus victoria ara saepe veritatis aiunt vergo abduco virtus solvo. Cuppedia canto appositus deprecator commodi confero demulceo crastinus amplexus eum. Adhaero titulus depono sustineo contra autus quidem.', '2023-08-12T19:11:37', null, null),
('3', '15', '8', '2', '4', 'Venustas toties vulnus.', 'Vulgo aranea uredo ducimus desolo succurro vis coniecto acer. Solvo vos coma trans deludo calcar. Defendo deficio caput vapulus angustus causa.', null, '2023-07-24T14:54:25', null, '2023-03-17T23:29:31'),
('3', '16', '7', '2', '1', 'Barba cohors totus nihil defero teneo accusamus.', 'Absconditus viscus id appositus abbas stella ocer spero sonitus. Addo audacia dedecor aliquid deserunt sortitus. Ater vallum nihil cattus carus dolorem asper.', null, '2024-09-24T13:59:01', null, '2024-08-15T08:47:23'),
('3', '16', '8', '2', '2', 'Pariatur vicissitudo vos votum decens exercitationem suasoria non.', 'Denuncio tondeo cervus cras averto collum. Vorago sortitus bos absorbeo depono. Creptio accedo adimpleo demergo utpote acsi sponte velit aperio adsidue.', 'Socius deputo reprehenderit torrens. Aspernatur anser desino aegrus conicio conatus demulceo valde. Quas cattus cruentus vinculum valens verbera verus ventito.', '2023-07-12T02:50:14', null, null),
('3', '17', '7', '2', '3', 'Pel caritas crepusculum esse.', 'Texo abutor spiritus abeo apto temeritas sollicito cultura substantia et. Illum agnitio alius surculus. Utor arbitro attollo cinis neque sumptus sapiente calco.', null, '2023-03-03T08:13:43', '2024-12-29T06:21:43', null),
('3', '17', '8', '2', '4', 'Animadverto sto debeo vivo.', 'Ante conduco condico animadverto ustulo eum causa volup officia crux. Adeo virga communis cibus temperantia alioqui. Cilicium tutis cometes carcer addo vaco doloremque abutor aegrotatio aliqua.', 'Varietas patior tametsi uxor curvo blanditiis civitas tres sordeo. Varius adeptio defessus totus contabesco validus administratio. Cimentarius thalassinus curtus eligendi celer soleo vilicus.', '2024-05-15T17:41:16', null, '2024-05-18T15:11:28'),
('3', '20', '7', '3', '1', 'Curso cohibeo alioqui stella eum vilitas creta aureus claudeo cometes.', 'Totidem conatus depraedor canto cunae decretum omnis demens. Tergum bestia aegrotatio conqueror torrens vado sapiente dicta. Sophismata audax uberrime aer caveo curvo repudiandae.', null, '2024-06-15T10:09:09', '2024-12-26T18:13:07', '2023-02-27T00:35:11'),
('3', '20', '8', '3', '2', 'Creber aureus patria campana attonbitus cohors tamquam tonsor.', 'Currus audentia cavus caries. Absorbeo demo tristis adsuesco amoveo. Velut fugit sum depopulo articulus tergiversatio valens subito cursim cedo.', null, '2024-06-14T00:51:13', null, null),
('4', '9', null, '1', '3', 'Ventito coruscus casus ambulo textor somnus acies tergo.', 'Armarium earum tabesco cilicium alius. Thesaurus arguo crepusculum studio laborum neque. Canis excepturi absconditus admitto terror exercitationem adhuc vulgus tubineus arca.', null, '2024-01-31T23:19:39', null, null),
('4', '10', null, '1', '4', 'Deripio combibo quod thorax vestigium.', 'Thalassinus adnuo claro amplus ducimus demum. Itaque custodia laborum aurum. Crur volo apostolus accommodo utor arcesso viriliter vaco.', null, '2024-05-04T22:52:33', null, '2024-07-06T14:14:01'),
('4', '11', null, '1', '1', 'Teres abutor tribuo audentia.', 'Praesentium tergeo utrum aegrotatio sursum. Arto cotidie universe enim admiratio spiculum vetus. Apto vigilo deprimo.', null, '2023-07-29T02:34:46', null, '2024-05-31T00:16:19'),
('4', '15', '9', '2', '2', 'Audentia comes deduco abbas.', 'Ascit tamen verbum audacia beneficium. Arma ars vitiosus coepi necessitatibus tersus. Admiratio valeo arcus curia possimus coepi testimonium stabilis tego teres.', 'Sonitus peior aurum. Timor adstringo molestias sophismata clam tenax. Neque tracto quos charisma adiuvo accedo.', '2024-09-30T15:43:07', null, '2023-02-10T05:05:23'),
('4', '15', '10', '2', '3', 'Alienus color tertius eveniet.', 'Error statim similique cotidie alioqui copia vos vallum usque. Colligo perferendis ceno amiculum nulla anser amicitia arbitro. Pectus deprimo admitto desino quis facere ipsam.', null, '2023-05-22T05:21:10', '2024-12-20T03:33:36', null),
('4', '16', '11', '2', '4', 'Video civitas vicissitudo canto sum clementia atqui sortitus cerno.', 'Reprehenderit vacuus somnus trado caute cogo aestas. Animadverto quod concido capitulus talis coadunatio eaque copiose deripio. Cruciamentum conculco vulgaris curtus vorago coepi somniculosus tenuis demulceo.', 'Repudiandae decet canis cursus repellendus calamitas cumque tergum rem quaerat. Comminor adnuo curo coniuratio. Atavus mollitia audentia acceptus umquam.', '2024-07-16T17:29:18', '2024-10-08T06:48:05', null),
('4', '16', '9', '2', '1', 'Summopere cito pauci.', 'Iste ascisco antepono cervus. Vel cavus aggredior tutis celo ante. Tutamen vulticulus cognomen ancilla vita convoco.', null, '2023-04-25T03:00:20', null, '2023-06-16T19:15:46'),
('4', '17', '10', '2', '2', 'Amissio infit bis spiritus aiunt deinde video deinde decimus.', 'Adaugeo talio caste. Virga conculco suppono. Sunt deduco angustus carcer strues amaritudo deduco articulus.', 'Bene creptio annus claudeo alveus tonsor. Verecundia corporis adfero tabgo. Acquiro super admoneo studio vehemens repudiandae curo cornu.', '2024-04-20T03:20:43', '2024-11-27T04:56:36', null),
('4', '17', '11', '2', '3', 'Ter urbs altus.', 'Autem aduro casus vesica coepi bos stips sint ater. Defungo talis corroboro suasoria dolore subnecto. Suasoria titulus statim tam varius subito caelum.', 'Stella deporto vos victoria accommodo odio. Catena ubi conforto assentator subnecto. Summisse ipsa capillus thymum.', '2023-02-02T09:32:20', '2024-11-14T17:59:27', null),
('4', '18', '9', '3', '4', 'Vulpes tunc solio casso cernuus caries.', 'Uter urbs derelinquo abeo deduco creo necessitatibus sortitus. Aut corrupti capillus varius vix tempore tenax complectus. Compono antea timor baiulus.', null, '2023-12-14T16:14:57', '2024-10-08T22:26:11', '2024-05-07T05:00:55'),
('5', '12', null, '1', '1', 'Assentator pecco auxilium ustilo.', 'Suggero cauda coerceo correptius nulla cubicularis abbas. Taceo caelum vomer barba casso tamisium coniecto depromo. Conitor texo accedo.', null, '2023-05-25T12:43:47', null, null),
('5', '13', null, '1', '2', 'Tersus labore error custodia.', 'Victoria caute vitae ante dedico animi. Creber templum sit quod aufero decimus autus. Corrupti vobis teneo culpo cohors talus.', null, '2024-09-18T06:41:02', null, null),
('5', '14', null, '1', '3', 'Auditor deleo cernuus vindico comparo acquiro demens paulatim voveo victoria.', 'Deporto officiis corpus tempore voluptate sulum eaque beatus. Defluo tremo aperio absum arbor accedo crudelis bellicus adicio commodo. Tonsor praesentium demo harum suscipit.', 'Capio canonicus voluptatibus vinculum. Crux numquam cornu totus odio patria cohibeo cubitum. Vir adversus celo admoveo coniecto.', '2024-09-04T09:01:45', null, null),
('5', '15', '12', '2', '4', 'Curiositas laborum voluntarius cuius circumvenio damno cunabula sursum vel derelinquo.', 'Crudelis terreo quia vomer. Audio amita solutio tepesco conatus adimpleo est. Absconditus anser consequatur.', 'Provident deserunt coruscus stultus. Ascit dens decimus vociferor aeger conturbo timor peior. Coniuratio alius color nam tum.', '2023-05-28T00:39:42', null, null),
('5', '15', '13', '2', '1', 'Ratione consuasor eaque demoror accusantium recusandae cresco.', 'Vinculum sufficio cupio tabesco. Capillus tabgo attonbitus stultus animi cruciamentum ascisco. Ultio ventito commodi adsuesco.', null, '2023-05-13T08:10:47', '2024-12-06T08:04:03', null),
('5', '16', '14', '2', '2', 'Charisma adficio conservo absque allatus abstergo deludo.', 'Vita nulla accommodo atrocitas ultra quibusdam arca pecco. Est suadeo solutio veniam. Distinctio decor ulterius theca venio ipsum absum cunctatio.', null, '2023-08-10T21:50:08', '2024-11-02T10:48:05', null),
('5', '16', '12', '2', '3', 'Vicinus vomito coerceo communis contego defessus numquam.', 'Tantillus tandem theca tyrannus tergeo ulciscor. Aspernatur corrumpo atrocitas utrimque verus cognomen sophismata dolorem molestiae totus. Aro summisse adsuesco speciosus arto pel sublime.', 'Cultura adiuvo doloribus callide vulticulus adfero utique solutio demo. Conturbo cena cultellus arguo illo cinis. Solvo delicate altus statim solutio crapula.', '2024-04-14T17:11:35', null, null),
('5', '17', '13', '2', '4', 'Viduo sumptus virtus accusantium eaque coruscus quod deprimo thema.', 'Currus pariatur aro defendo. Quasi suasoria catena arguo cumque eum collum tergum cumque similique. Pauper suscipit cultura.', null, '2024-06-14T03:36:51', null, '2024-08-09T04:24:12'),
('5', '17', '14', '2', '1', 'Uredo derideo concido.', 'Capillus vito vobis cubo recusandae totidem. Ambulo vae peior. Laboriosam absconditus ad.', 'Depromo vorago statim soleo corona tempus creptio tracto vulnus. Arbor appositus cura ars. Vestigium vulgaris quaerat earum.', '2024-09-11T03:39:58', null, '2023-03-26T16:20:46'),
('5', '18', '12', '3', '2', 'Mollitia mollitia dolore deserunt aro cur tergeo repellendus denique.', 'Spiritus quo nesciunt volubilis comprehendo. Aestus vaco angustus tamisium absconditus. Molestiae abscido artificiose vitae viridis confido officia tubineus civitas.', 'Aer vomer caste thesaurus decimus tempora sub. Claustrum nesciunt caveo cresco carmen debilito candidus conicio admoveo. Aliquam vomica aperte.', '2024-06-03T00:32:48', null, '2023-08-05T08:58:44');
