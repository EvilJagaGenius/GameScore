DROP TRIGGER IF EXISTS calcTotalScore;
DELIMITER @@@;


create trigger calcTotalScore after update on ActiveMatchPlayerConditionScore FOR EACH ROW
BEGIN
UPDATE Player JOIN (select SUM(score) as totalScoreSum,playerID from ActiveMatchPlayerConditionScore WHERE playerID=new.playerID GROUP By playerID) as newTable using(playerID) SET totalScore=totalScoreSum;
END@@@;