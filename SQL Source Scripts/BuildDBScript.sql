DROP TABLE IF EXISTS ActiveMatchPlayerConditionScore;
DROP TABLE IF EXISTS AppUserHistoryGame;
DROP TABLE IF EXISTS AppUserInteractTemplate;
DROP TABLE IF EXISTS AppUserPlayedGame;
DROP TABLE IF EXISTS AppUserRecommendedGame;
DROP TABLE IF EXISTS Player;
DROP TABLE IF EXISTS ActiveMatch;
DROP TABLE IF EXISTS Report;
DROP TABLE IF EXISTS ValueRow;
DROP TABLE IF EXISTS ScoringCondition;
DROP TABLE IF EXISTS Template;
DROP TABLE IF EXISTS AppUser;
DROP TABLE IF EXISTS Game;



CREATE TABLE Game (
gameID INT NOT NULL AUTO_INCREMENT,
gameName VARCHAR(100),
pictureURL VARCHAR(100) DEFAULT 'https://img-authors.flaticon.com/google.jpg',
PRIMARY KEY (gameID));

CREATE TABLE AppUser(
userID INT NOT NULL AUTO_INCREMENT,
username VARCHAR(30),
userPassword VARCHAR(100),
winRate FLOAT DEFAULT 0.0,
avatarID INT DEFAULT 0,
hiddenProfile BOOLEAN DEFAULT false,
email VARCHAR(100),
credHash VARCHAR(100),
admin BOOL DEFAULT FALSE,
resetPasswordToken VARCHAR(100),
resetUsernameToken VARCHAR(100),
PRIMARY KEY(userID));

CREATE TABLE Template (
templateID INT NOT NULL AUTO_INCREMENT,
gameID INT,
numRatings INT DEFAULT 0,
averageRating FLOAT default 0,
templateName VARCHAR(100),
userID int,
PRIMARY KEY (templateID,gameID),
CONSTRAINT fk_template_gameID_game FOREIGN KEY (gameID) REFERENCES Game(gameID),
CONSTRAINT fk_template_userID_appuser FOREIGN KEY (userID) REFERENCES AppUser(userID));

CREATE TABLE ScoringCondition (
conditionID INT NOT NULL AUTO_INCREMENT,
gameID INT NOT NULL,
templateID INT NOT NULL,
conditionName VARCHAR (50),
description VARCHAR(200) DEFAULT '',
maxPerGame INT DEFAULT 0,
maxPerPlayer INT DEFAULT 0,
scoringType ENUM ('Linear','Tabular') DEFAULT 'Linear',
inputType ENUM ('Increment','Textbox') DEFAULT 'Increment',
pointMultiplier FLOAT DEFAULT 1,
maxPerPlayerActive boolean DEFAULT false,
maxPerGameActive boolean DEFAULT false,
PRIMARY KEY(conditionID,gameID,templateID),
CONSTRAINT fk_scoringcondition_gameID_game FOREIGN KEY(gameID) REFERENCES Game(gameID),
CONSTRAINT fk_scoringcondition_templateID_template FOREIGN KEY(templateID) REFERENCES Template(templateID));

CREATE TABLE ValueRow (
rowID INT NOT NULL AUTO_INCREMENT,
conditionID INT NOT NULL,
templateID INT NOT NULL,
gameID INT NOT NULL,
inputMax FLOAT DEFAULT 10,
inputMin FLOAT DEFAULT 0,
outputValue FLOAT DEFAULT 1,
PRIMARY KEY(rowID,gameID,conditionID,templateID),
CONSTRAINT fk_valuerow_conditionID_scoringcondition FOREIGN KEY(conditionID) REFERENCES ScoringCondition(conditionID),
CONSTRAINT fk_valuerow_gameID_game FOREIGN KEY(gameID) REFERENCES Game(gameID),
CONSTRAINT fk_valuerow_tempalteID_template FOREIGN KEY(templateID) REFERENCES Template(templateID));

CREATE TABLE Report (
reportID INT NOT NULL AUTO_INCREMENT,
description VARCHAR(200) DEFAULT '',
reason ENUM('Template','Username') DEFAULT 'Template',
templateID INT,
gameID INT,
PRIMARY KEY(reportID),
CONSTRAINT fk_report_gameID_game FOREIGN KEY(gameID) REFERENCES Game(gameID),
CONSTRAINT fk_report_templateID_template FOREIGN KEY(templateID) REFERENCES Template(templateID));

CREATE TABLE ActiveMatch (
matchID INT NOT NULL AUTO_INCREMENT,
templateID INT,	
gameID INT,
creationTime DateTime default now(),
active BOOLEAN DEFAULT true,
joinCode VARCHAR(15),
PRIMARY KEY(matchID),
CONSTRAINT fk_activematch_gameID_game FOREIGN KEY(gameID) REFERENCES Game(gameID));

CREATE TABLE Player (
playerID INT NOT NULL AUTO_INCREMENT,
userID INT,
color ENUM('Red','Blue','Green','Purple','Yellow','Pink','Black','Orange') DEFAULT 'Red',
displayOrder INT,
totalScore FLOAT,
displayName VARCHAR (50),
matchID INT,
isHost BOOL DEFAULT false,
PRIMARY KEY(playerID),
CONSTRAINT fk_player_matchID_match FOREIGN KEY(matchID) REFERENCES ActiveMatch(matchID),
FOREIGN KEY(userID) REFERENCES AppUser(userID));

CREATE TABLE AppUserRecommendedGame (
gameID INT,
userID INT,
PRIMARY KEY(gameID,userID),
CONSTRAINT fk_appuserrecommendedgame_gameID_game FOREIGN KEY(gameID) REFERENCES Game(gameID),
CONSTRAINT fk_appuserrecommnededgame_userID_appuser FOREIGN KEY(userID) REFERENCES AppUser(userID));

CREATE TABLE AppUserPlayedGame (
userID INT,
gameID INT,
gamesWon INT DEFAULT 1,
gamesPlayed INT DEFAULT 2,
aggregateScore INT DEFAULT 50,
winrate FLOAT DEFAULT 0.5,
averageScore FLOAT DEFAUlT 25,
PRIMARY KEY(userID,gameID),
CONSTRAINT fk_appuserplayedgame_gameID_game FOREIGN KEY(gameID) REFERENCES Game(gameID),
CONSTRAINT fk_appuserplayedgame_userID_appuser FOREIGN KEY(userID) REFERENCES AppUser(userID));

CREATE TABLE AppUserInteractTemplate (
userID INT,
gameID INT,
templateID INT,
rating FLOAT,
favorited BOOLEAN DEFAULT false,
lastPlayed datetime,
PRIMARY KEY(userID,gameID,templateID),
CONSTRAINT fk_appuserinteracttemplate_gameID_game FOREIGN KEY(gameID) REFERENCES Game(gameID),
CONSTRAINT fk_appuserinteracttemplate_templateID_template FOREIGN KEY(templateID) REFERENCES Template(templateID),
CONSTRAINT fk_appuserinteracttemplate_userID_appuser FOREIGN KEY(userID) REFERENCES AppUser(userID));

CREATE TABLE AppUserHistoryGame (
historyID INT NOT NULL AUTO_INCREMENT,
userID INT,
gameID INT,
gameHistoryString VARCHAR(10000),
PRIMARY KEY(historyID,userID,gameID),
CONSTRAINT appuserhistorygame_gameID_game FOREIGN KEY(gameID) REFERENCES Game(gameID),
CONSTRAINT appuserhistorygame_userID_appuser FOREIGN KEY(userID) REFERENCES AppUser(userID));

CREATE TABLE ActiveMatchPlayerConditionScore (
matchID INT,
playerID INT,
conditionID INT,
gameID INT,
templateID INT,
score FLOAT,
value FLOAT,
PRIMARY KEY(matchID,playerID,conditionID,gameID,templateID),
CONSTRAINT fk_activematchplayerconditionscore_gameID_game FOREIGN KEY(gameID) REFERENCES Game(gameID),
CONSTRAINT fk_activematchplayerconditionscore_matchID_activematch FOREIGN KEY(matchID) REFERENCES ActiveMatch(matchID),
CONSTRAINT fk_activematchplayerconditionscore_conditionID_scoringcondition FOREIGN KEY(conditionID) REFERENCES ScoringCondition(conditionID),
CONSTRAINT fk_activematchplayerconditionscore_playerID_player FOREIGN KEY(playerID) REFERENCES Player(playerID));


