DROP TRIGGER IF EXISTS calcTotalScore;
DROP TRIGGER IF EXISTS calcGameStats;
DROP EVENT IF EXISTS purgeActiveMatches;
DELIMITER @@@;


create trigger calcTotalScore after update on ActiveMatchPlayerConditionScore FOR EACH ROW
BEGIN
UPDATE Player JOIN (select SUM(score) as totalScoreSum,playerID from ActiveMatchPlayerConditionScore WHERE playerID=new.playerID GROUP By playerID) as newTable using(playerID) SET totalScore=totalScoreSum;
END@@@;

create trigger  calcGameStats before update on AppUserPlayedGame FOR EACH row
begin
SET new.averageScore = (new.aggregateScore/new.gamesPlayed);
SET new.winRate = (new.gamesWon/new.gamesPlayed);
END@@@;


CREATE EVENT purgeActiveMatches
ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 1 HOUR
ON COMPLETION PRESERVE

DO BEGIN
	  DELETE ActiveMatchPlayerConditionScore FROM ActiveMatchPlayerConditionScore JOIN ActiveMatch using(matchID) WHERE creationTime < DATE_SUB(NOW(), INTERVAL 3 HOUR) and active = false;
	  DELETE Player FROM Player JOIN ActiveMatch using(matchID) WHERE creationTime < DATE_SUB(NOW(), INTERVAL 3 HOUR) AND active = false;
	  DELETE ActiveMatch FROM ActiveMatch WHERE creationTime < DATE_SUB(NOW(), INTERVAL 3 HOUR) AND active = false;
END@@@;