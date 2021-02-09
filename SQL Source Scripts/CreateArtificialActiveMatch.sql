INSERT INTO Player(playerID,userID,color, displayOrder,totalScore,displayName,matchID)
VALUES(NULL,1,'RED',0,15,"Caustic Prince",1);

INSERT INTO Player(playerID,userID,color,displayOrder,totalScore,displayName,matchID)
VALUES(NULL,NULL,'BLUE',1,45,"Little Duckling",1);

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