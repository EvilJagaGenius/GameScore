
INSERT INTO Game (gameID,gameName)
VALUES(NULL,'Terraforming Mars');

INSERT INTO AppUser(userID,username,userPassword,winRate,avatarID,hiddenProfile,email)
VALUES(NULL,'Caustic Prince',SHA1('password'),0.45,1,false,'ccjabc4@gmail.com');

INSERT INTO Template(gameID,numRatings,averageRating,templateName,userID)
VALUES(1,4,4.32,'Mars Scorer 2.0',1);

INSERT INTO Template(gameID,numRatings,averageRating,templateName,userID)
VALUES(1,3,4.12,'Mars Scorer Lite',1);

INSERT INTO Template(gameID,numRatings,averageRating,templateName,userID)
VALUES(1,1,1.00,'The Best Mars Scorer',1);

INSERT INTO ScoringCondition(conditionID,gameID,templateID,conditionName,description,maxPerGame,maxPerPlayer,scoringType,inputType,pointMultiplier)
VALUES(NULL,1,1,'Greenlands','Total Greenlands of your color',-1,-1,'Linear','Increment',1);

INSERT INTO ValueRow (rowID, conditionID, templateID,gameID,inputMax,inputMin,outputValue)
VALUES(NULL,1,1,1,10,0,1);

INSERT INTO Report(reportID,description,reason,templateID,gameID)
VALUES(NULL,'It has bad words','Template',1,1);

INSERT INTO ActiveMatch(matchID,templateID,gameID)
VALUES(NULL,1,1);

INSERT INTO Player(playerID,userID,color)
VALUES(NULL,1,'RED');

INSERT INTO AppUserRecommendedGame(gameID,userID)
VALUES(1,1);

INSERT INTO AppUserPlayedGame(userID,gameID,gamesWon,gamesPlayed,aggregateScore,winrate,averageScore)
VALUES(1,1,5,10,24,0.5,2.4);

INSERT INTO AppUserInteractTemplate(userID,gameID,templateID,rating,favorited,lastPlayed)
VALUES(1,1,1,4.31,true,now());

INSERT INTO AppUserHistoryGame(userID,gameID,gameHistoryString)
VALUES(1,1,'Bob: 43\nLarry:12');

INSERT INTO ActiveMatchPlayerConditionScore(matchID,playerID,conditionID,gameID,templateID,score)
VALUES(1,1,1,1,1,14);