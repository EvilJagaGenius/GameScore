
INSERT INTO Game (gameID,gameName)
VALUES(NULL,'Terraforming Mars');

INSERT INTO Game (gameID,gameName)
VALUES(NULL,'Ticket to Ride');

INSERT INTO AppUser(userID,username,userPassword,winRate,avatarID,hiddenProfile,email)
VALUES(NULL,'Caustic Prince',SHA1('password'),0.45,1,false,'ccjabc4@gmail.com');

INSERT INTO Template(gameID,numRatings,averageRating,templateName,userID)
VALUES(1,4,4.32,'Mars Scorer 2.0',1);

INSERT INTO Template(gameID,numRatings,averageRating,templateName,userID)
VALUES(1,3,4.12,'Mars Scorer Lite',1);

INSERT INTO Template(gameID,numRatings,averageRating,templateName,userID)
VALUES(1,1,1.00,'The Best Mars Scorer',1);

INSERT INTO Template(gameID,numRatings,averageRating,templateName,userID)
VALUES(2,1,5.00,'Ticket to Ride Scorer v2',1);

INSERT INTO ScoringCondition(conditionID,gameID,templateID,conditionName,description,maxPerGame,maxPerPlayer,scoringType,inputType,pointMultiplier)
VALUES(NULL,1,1,'Greenlands','Total Greenlands of your color',-1,-1,'Linear','Increment',1);

#Ticket to Ride Scorer for Testing Template
INSERT INTO ScoringCondition(conditionID,gameID,templateID,conditionName,description,maxPerGame,maxPerPlayer,scoringType,inputType,pointMultiplier)
VALUES(NULL,2,4,'1-Length Trains','Individual train routes requiring one train',-1,-1,'Linear','Increment',1);

INSERT INTO ScoringCondition(conditionID,gameID,templateID,conditionName,description,maxPerGame,maxPerPlayer,scoringType,inputType,pointMultiplier)
VALUES(NULL,2,4,'2-Length Trains','Individual train routes requiring two trains',-1,-1,'Linear','Increment',2);

INSERT INTO ScoringCondition(conditionID,gameID,templateID,conditionName,description,maxPerGame,maxPerPlayer,scoringType,inputType,pointMultiplier)
VALUES(NULL,2,4,'Completed Tickets','Adding completed tickets and subtracting failed tickets',-1,-1,'Linear','Textbox',1);

INSERT INTO ScoringCondition(conditionID,gameID,templateID,conditionName,description,maxPerGame,maxPerPlayer,scoringType,inputType,pointMultiplier)
VALUES(NULL,2,4,'Longest Train','Player with the longest consecutive train',1,-1,'Linear','Increment',10);

INSERT INTO ScoringCondition(conditionID,gameID,templateID,conditionName,description,maxPerGame,maxPerPlayer,scoringType,inputType,pointMultiplier)
VALUES(NULL,2,4,'Train Depots','# of unused train depots',-1,3,'Linear','Increment',4);

INSERT INTO ActiveMatch(templateID, gameID)
VALUES(4,2);

INSERT INTO ValueRow (rowID, conditionID, templateID,gameID,inputMax,inputMin,outputValue)
VALUES(NULL,1,1,1,10,0,1);

INSERT INTO Report(reportID,description,reason,templateID,gameID)
VALUES(NULL,'It has bad words','Template',1,1);

INSERT INTO Player(playerID,userID,color, displayOrder,totalScore,displayName,matchID)
VALUES(NULL,1,'RED',0,15,"Caustic Prince",1);

INSERT INTO Player(playerID,userID,color,displayOrder,totalScore,displayName,matchID)
VALUES(NULL,NULL,'BLUE',1,45,"Little Duckling",1);

INSERT INTO AppUserRecommendedGame(gameID,userID)
VALUES(1,1);

INSERT INTO AppUserPlayedGame(userID,gameID,gamesWon,gamesPlayed,aggregateScore,winrate,averageScore)
VALUES(1,1,5,10,24,0.5,2.4);

INSERT INTO AppUserInteractTemplate(userID,gameID,templateID,rating,favorited,lastPlayed)
VALUES(1,1,1,4.31,true,now());

INSERT INTO AppUserHistoryGame(userID,gameID,gameHistoryString)
VALUES(1,1,'Bob: 43\nLarry:12');

#Both Player Values for Ticket to Ride Scoring (1 train length)
INSERT INTO ActiveMatchPlayerConditionScore(matchID,playerID,conditionID,gameID,templateID,value,score)
VALUES(1,1,2,2,4,2,2);
INSERT INTO ActiveMatchPlayerConditionScore(matchID,playerID,conditionID,gameID,templateID,value,score)
VALUES(1,2,2,2,4,0,0);

#Both Player Values for Ticket to Ride Scoring (2 train length)
INSERT INTO ActiveMatchPlayerConditionScore(matchID,playerID,conditionID,gameID,templateID,value,score)
VALUES(1,1,3,2,4,0,0);
INSERT INTO ActiveMatchPlayerConditionScore(matchID,playerID,conditionID,gameID,templateID,value,score)
VALUES(1,2,3,2,4,7,14);

#Both Player Values for Ticket to Ride Scoring (Tickets)
INSERT INTO ActiveMatchPlayerConditionScore(matchID,playerID,conditionID,gameID,templateID,value,score)
VALUES(1,1,4,2,4,53,53);
INSERT INTO ActiveMatchPlayerConditionScore(matchID,playerID,conditionID,gameID,templateID,value,score)
VALUES(1,2,4,2,4,85,85);

#Both Player Values for Ticket to Ride Scoring (Longest Train)
INSERT INTO ActiveMatchPlayerConditionScore(matchID,playerID,conditionID,gameID,templateID,value,score)
VALUES(1,1,5,2,4,0,0);
INSERT INTO ActiveMatchPlayerConditionScore(matchID,playerID,conditionID,gameID,templateID,value,score)
VALUES(1,2,5,2,4,1,10);

#Both Player Values for Ticket to Ride Scoring (Train Depots)
INSERT INTO ActiveMatchPlayerConditionScore(matchID,playerID,conditionID,gameID,templateID,value,score)
VALUES(1,1,6,2,4,1,4);
INSERT INTO ActiveMatchPlayerConditionScore(matchID,playerID,conditionID,gameID,templateID,value,score)
VALUES(1,2,6,2,4,2,8);
