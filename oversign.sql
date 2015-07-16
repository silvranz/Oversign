-- phpMyAdmin SQL Dump
-- version 3.5.2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jul 16, 2015 at 12:04 PM
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
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

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
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `hashtag`
--

CREATE TABLE IF NOT EXISTS `hashtag` (
  `HashtagID` int(11) NOT NULL AUTO_INCREMENT,
  `Hashtag` varchar(30) NOT NULL,
  `Status` char(1) NOT NULL,
  PRIMARY KEY (`HashtagID`)
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

INSERT INTO `userbasic` (`UserID`, `UserEmail`, `UserFullName`, `UserPassword`, `UserPhone`, `UserAddress`, `UserCity`, `UserProvince`, `UserCountry`, `UserPostalCode`, `PersonalUser`, `isAdministrator`, `UserStatus`) VALUES
(1, 'amuliawan93@gmail.com', 'Theresia Angela Muliawan', 'angel123', '081281849766', 'Kalipasir pengarengan 14', 'Jakarta Pusat', 'DKI Jakarta', 'Indonesia', '10340', 1, 1, 'A');

--
-- Constraints for dumped tables
--

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

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
