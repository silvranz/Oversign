-- phpMyAdmin SQL Dump
-- version 3.5.2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jul 23, 2015 at 04:16 PM
-- Server version: 5.5.25a
-- PHP Version: 5.4.4

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `oversign`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetAllUser`()
    NO SQL
SELECT * FROM UserBasic$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetForumComment`(IN `ForumIDParam` INT)
    NO SQL
SELECT DISTINCT c.CommentID, c.Comment, c.CommentDate,
ub.UserFullName, ub.UserPhoto, CommentDate
FROM
Comment c 
JOIN Forum f on c.ForumID = f.ForumID and f.ForumStatus='A'
JOIN userbasic ub on ub.UserID=c.CommentAuthor AND ub.UserStatus='A'
WHERE c.CommentStatus='A' AND c.ForumID=ForumIDParam$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetForumContent`(IN `ForumIDParam` INT)
    NO SQL
SELECT DISTINCT f.ForumID, f.ForumTitle,
Count(c.CommentID) 'NumberOfComment', 
CASE WHEN fe.Count is null then 0 else fe.Count END
'NumberOfEye',
ub.UserFullName, ub.UserPhoto, ForumCreatedDate,
ForumContent
FROM
Forum f
LEFT JOIN Comment c on c.ForumID = f.ForumID 
	and c.CommentStatus='A'
LEFT JOIN ForumEye fe on fe.ForumID = f.ForumID
JOIN userbasic ub on ub.UserID=f.ForumAuthor AND ub.UserStatus='A'
WHERE f.ForumStatus='A' AND f.ForumID=ForumIDParam
GROUP BY f.ForumID, ForumTitle, 
ub.UserFullName, ub.UserPhoto, ForumCreatedDate,
ForumContent$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetForumSearchResult`(IN `search` VARCHAR(200))
    NO SQL
SELECT f.ForumID, f.ForumTitle,
Count(c.CommentID) 'NumberOfComment', 
CASE WHEN fe.Count is null then 0 else fe.Count END
'NumberOfEye',
ub.UserFullName, ForumCreatedDate 
FROM
Forum f
LEFT JOIN Comment c on c.ForumID = f.ForumID 
	and c.CommentStatus='A'
LEFT JOIN ForumEye fe on fe.ForumID = f.ForumID
JOIN userbasic ub on ub.UserID=f.ForumAuthor
WHERE f.ForumStatus='A'
GROUP BY f.ForumID, ForumTitle, 
ub.UserFullName, ForumCreatedDate
ORDER BY NumberOfComment asc, NumberOfEye asc
limit 10$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetHotThread`()
    NO SQL
SELECT f.ForumID, f.ForumTitle,
Count(c.CommentID) 'NumberOfComment', 
CASE WHEN fe.Count is null then 0 else fe.Count END
'NumberOfEye',
ub.UserFullName, ForumCreatedDate 
FROM
Forum f
LEFT JOIN Comment c on c.ForumID = f.ForumID 
	and c.CommentStatus='A'
LEFT JOIN ForumEye fe on fe.ForumID = f.ForumID
JOIN userbasic ub on ub.UserID=f.ForumAuthor
WHERE f.ForumStatus='A'
GROUP BY f.ForumID, ForumTitle, 
ub.UserFullName, ForumCreatedDate
ORDER BY NumberOfComment asc, NumberOfEye asc
limit 10$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetPopularHashtag`()
    NO SQL
SELECT h.HashtagID, Hashtag
FROM hashtag h
LEFT JOIN ForumHashtag fh on fh.HashtagID=h.HashtagID
LEFT JOIN comment c on c.ForumID=fh.ForumID and c.CommentStatus='A'
LEFT JOIN forumeye fe on fe.ForumID=fh.ForumID
LEFT JOIN forum f on f.ForumId=fe.ForumID AND f.ForumStatus='A'
WHERE h.Status='A'
GROUP BY h.HashtagID, Hashtag
ORDER BY COUNT(CommentID) asc, fe.Count asc
LIMIT 10$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetUserLogin`(IN `inUserEmail` VARCHAR(50), IN `inUserPassword` VARCHAR(200))
    NO SQL
BEGIN
SELECT UserID, UserFullName, isAdministrator, 
UserStatus
FROM UserBasic
WHERE
UserEmail = inUserEmail AND 
UserPassword=inUserPassword
AND UserStatus='A';
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `InsertContactUs`(IN `inName` VARCHAR(100), IN `inEmail` VARCHAR(50), IN `inContent` VARCHAR(500), IN `inAuthor` INT)
    NO SQL
BEGIN
INSERT INTO ContactUS 
(ContactUsName, ContactUsEmail, 
ContactUsContent, ContactUsAuthor)
VALUES
(inName, inEmail, inContent, inAuthor);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `RegisterNewMember`(IN `inRegEmail` VARCHAR(50), IN `inRegPassword` VARCHAR(200))
    NO SQL
BEGIN
IF EXISTS(SELECT UserEmail 
	FROM UserBasic 
	WHERE UserEmail = inRegEmail)
THEN
SELECT -1 As 'Result';
ELSE
INSERT INTO 
UserBasic(UserEmail, UserPassword, UserStatus) 
VALUES
(inRegEmail, inRegPassword, 'N');
END IF;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `comment`
--

CREATE TABLE IF NOT EXISTS `comment` (
  `CommentID` int(11) NOT NULL AUTO_INCREMENT,
  `Comment` int(11) NOT NULL,
  `CommentAuthor` int(11) NOT NULL,
  `CommentStatus` char(1) NOT NULL,
  `CommentDate` datetime NOT NULL,
  `ForumID` int(11) NOT NULL,
  PRIMARY KEY (`CommentID`),
  KEY `CommentAuthor` (`CommentAuthor`),
  KEY `ForumID` (`ForumID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `company`
--

CREATE TABLE IF NOT EXISTS `company` (
  `CompanyID` int(11) NOT NULL AUTO_INCREMENT,
  `CompanyAddress` varchar(200) DEFAULT NULL,
  `CompanyCity` varchar(50) DEFAULT NULL,
  `CompanyProvince` varchar(50) DEFAULT NULL,
  `CompanyCountry` varchar(50) DEFAULT NULL,
  `CompanyPostalCode` varchar(20) DEFAULT NULL,
  `CompanyAuthor` int(11) NOT NULL,
  PRIMARY KEY (`CompanyID`),
  UNIQUE KEY `CompanyAuthor_2` (`CompanyAuthor`),
  KEY `CompanyAuthor` (`CompanyAuthor`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `contactus`
--

CREATE TABLE IF NOT EXISTS `contactus` (
  `ContactUsID` int(11) NOT NULL AUTO_INCREMENT,
  `ContactUsName` varchar(100) NOT NULL,
  `ContactUsEmail` varchar(50) NOT NULL,
  `ContactUsContent` varchar(5000) NOT NULL,
  `ContactUsAuthor` int(11) DEFAULT NULL,
  PRIMARY KEY (`ContactUsID`),
  KEY `ContactUsAuthor` (`ContactUsAuthor`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `forum`
--

CREATE TABLE IF NOT EXISTS `forum` (
  `ForumID` int(11) NOT NULL AUTO_INCREMENT,
  `ForumContent` varchar(100) NOT NULL,
  `ForumTitle` varchar(100) NOT NULL,
  `ForumAuthor` int(11) NOT NULL,
  `ForumCreatedDate` datetime NOT NULL,
  `ForumLastModified` datetime NOT NULL,
  `ForumStatus` char(1) NOT NULL,
  PRIMARY KEY (`ForumID`),
  UNIQUE KEY `ForumAuthor` (`ForumAuthor`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `forum`
--

INSERT INTO `forum` (`ForumID`, `ForumContent`, `ForumTitle`, `ForumAuthor`, `ForumCreatedDate`, `ForumLastModified`, `ForumStatus`) VALUES
(1, 'mau tau aja atau mau tau bangeeet?', 'How To Make a Free Website with OverSign?', 1, '2015-07-19 14:54:00', '2015-07-19 14:54:00', 'A');

-- --------------------------------------------------------

--
-- Table structure for table `forumeye`
--

CREATE TABLE IF NOT EXISTS `forumeye` (
  `ForumEyeID` int(11) NOT NULL AUTO_INCREMENT,
  `ForumID` int(11) NOT NULL,
  `Count` int(11) NOT NULL,
  PRIMARY KEY (`ForumEyeID`),
  KEY `ForumID` (`ForumID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `forumhashtag`
--

CREATE TABLE IF NOT EXISTS `forumhashtag` (
  `ForumHashtagID` int(11) NOT NULL AUTO_INCREMENT,
  `HashtagID` int(11) NOT NULL,
  `ForumID` int(11) NOT NULL,
  PRIMARY KEY (`ForumHashtagID`),
  KEY `HashtagID` (`HashtagID`,`ForumID`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `forumhashtag`
--

INSERT INTO `forumhashtag` (`ForumHashtagID`, `HashtagID`, `ForumID`) VALUES
(1, 1, 1),
(2, 2, 1);

-- --------------------------------------------------------

--
-- Table structure for table `hashtag`
--

CREATE TABLE IF NOT EXISTS `hashtag` (
  `HashtagID` int(11) NOT NULL AUTO_INCREMENT,
  `Hashtag` varchar(30) NOT NULL,
  `Status` char(1) NOT NULL,
  PRIMARY KEY (`HashtagID`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `hashtag`
--

INSERT INTO `hashtag` (`HashtagID`, `Hashtag`, `Status`) VALUES
(1, 'FAQ', 'A'),
(2, 'StoreTutorial', 'A');

-- --------------------------------------------------------

--
-- Table structure for table `template`
--

CREATE TABLE IF NOT EXISTS `template` (
  `TemplateID` int(11) NOT NULL AUTO_INCREMENT,
  `TemplateTitle` varchar(50) NOT NULL,
  `TemplateDescription` varchar(200) NOT NULL,
  `PreviewImage` varchar(100) NOT NULL,
  `TemplateCategoryID` int(11) NOT NULL,
  `TemplateSavePath` varchar(100) NOT NULL,
  `TemplateCreatedDate` datetime NOT NULL,
  PRIMARY KEY (`TemplateID`),
  KEY `TemplateCategoryID` (`TemplateCategoryID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `templatecategory`
--

CREATE TABLE IF NOT EXISTS `templatecategory` (
  `TemplateCategoryID` int(11) NOT NULL AUTO_INCREMENT,
  `TemplateCategoryName` varchar(50) NOT NULL,
  PRIMARY KEY (`TemplateCategoryID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `templaterating`
--

CREATE TABLE IF NOT EXISTS `templaterating` (
  `TemplateRatingID` int(11) NOT NULL AUTO_INCREMENT,
  `RatingBy` int(11) NOT NULL,
  `TemplateID` int(11) NOT NULL,
  `Rating` int(11) NOT NULL,
  PRIMARY KEY (`TemplateRatingID`),
  KEY `RatingBy` (`RatingBy`,`TemplateID`),
  KEY `TemplateID` (`TemplateID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `userbasic`
--

CREATE TABLE IF NOT EXISTS `userbasic` (
  `UserID` int(11) NOT NULL AUTO_INCREMENT,
  `UserEmail` varchar(50) NOT NULL,
  `UserFullName` varchar(100) DEFAULT NULL,
  `UserPassword` varchar(200) NOT NULL,
  `UserPhoto` varchar(100) DEFAULT NULL,
  `UserPhone` varchar(100) DEFAULT NULL,
  `UserAddress` varchar(200) DEFAULT NULL,
  `UserCity` varchar(50) DEFAULT NULL,
  `UserProvince` varchar(50) DEFAULT NULL,
  `UserCountry` varchar(50) DEFAULT NULL,
  `UserPostalCode` varchar(20) DEFAULT NULL,
  `PersonalUser` int(11) NOT NULL,
  `isAdministrator` int(11) NOT NULL,
  `UserStatus` char(1) NOT NULL,
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `UserEmail` (`UserEmail`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `userbasic`
--

INSERT INTO `userbasic` (`UserID`, `UserEmail`, `UserFullName`, `UserPassword`, `UserPhoto`, `UserPhone`, `UserAddress`, `UserCity`, `UserProvince`, `UserCountry`, `UserPostalCode`, `PersonalUser`, `isAdministrator`, `UserStatus`) VALUES
(1, 'amuliawan93@gmail.com', 'Theresia Angela Muliawan', 'angel123', NULL, '081281849766', 'Kalipasir pengarengan 14', 'Jakarta Pusat', 'DKI Jakarta', 'Indonesia', '10340', 1, 1, 'A');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `comment`
--
ALTER TABLE `comment`
  ADD CONSTRAINT `comment_ibfk_2` FOREIGN KEY (`ForumID`) REFERENCES `forum` (`ForumID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comment_ibfk_1` FOREIGN KEY (`CommentAuthor`) REFERENCES `userbasic` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `company`
--
ALTER TABLE `company`
  ADD CONSTRAINT `company_ibfk_1` FOREIGN KEY (`CompanyAuthor`) REFERENCES `userbasic` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `forum`
--
ALTER TABLE `forum`
  ADD CONSTRAINT `forum_ibfk_1` FOREIGN KEY (`ForumAuthor`) REFERENCES `userbasic` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `forumeye`
--
ALTER TABLE `forumeye`
  ADD CONSTRAINT `forumeye_ibfk_1` FOREIGN KEY (`ForumID`) REFERENCES `forum` (`ForumID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `template`
--
ALTER TABLE `template`
  ADD CONSTRAINT `template_ibfk_1` FOREIGN KEY (`TemplateCategoryID`) REFERENCES `templatecategory` (`TemplateCategoryID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `templaterating`
--
ALTER TABLE `templaterating`
  ADD CONSTRAINT `templaterating_ibfk_2` FOREIGN KEY (`TemplateID`) REFERENCES `template` (`TemplateID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `templaterating_ibfk_1` FOREIGN KEY (`RatingBy`) REFERENCES `userbasic` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
