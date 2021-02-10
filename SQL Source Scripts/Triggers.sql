DROP TRIGGER IF EXISTS calcTotalScore;
DROP TRIGGER IF EXISTS calcGameStats;
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