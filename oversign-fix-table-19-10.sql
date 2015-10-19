-- phpMyAdmin SQL Dump
-- version 4.4.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Oct 19, 2015 at 02:46 PM
-- Server version: 5.6.26
-- PHP Version: 5.6.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

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

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetForumComment`(IN `inForumID` INT)
    NO SQL
SELECT DISTINCT c.CommentID, c.Comment, c.CommentDate,
ub.UserFullName, ub.UserPhoto, CommentDate
FROM
Comment c 
JOIN Forum f on c.ForumID = f.ForumID and f.ForumStatus='A'
JOIN userbasic ub on ub.UserID=c.CommentAuthor AND ub.UserStatus='A'
WHERE c.CommentStatus='A' AND c.ForumID=inForumID$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetForumContent`(IN `inForumID` INT)
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
WHERE f.ForumStatus='A' AND f.ForumID=inForumID
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
WHERE f.ForumStatus='A' AND (f.ForumTitle like CONCAT('%',search,'%') OR f.ForumContent like CONCAT('%',search,'%'))
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
ub.UserFullName, 
DATE_FORMAT(ForumCreatedDate ,'%d %b %Y %h:%i %p') 
'ForumCreatedDate'
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

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetTemplate`(IN `limitpage` INT, IN `paramsorting` INT, IN `categoryid` INT, IN `offsetpage` INT)
    NO SQL
SELECT t.TemplateID, TemplateTitle, TemplateDescription,
PreviewImage, t.TemplateCategoryID,
(SUM(Rating)/COUNT(TemplateRatingID)) 'Rating',
SUM(Rating),
COUNT(TemplateRatingID)
, TemplateCreatedDate FROM Template t
JOIN TemplateCategory tc on t.TemplateCategoryID=tc.TemplateCategoryID
LEFT JOIN TemplateRating tr on t.TemplateID=tr.TemplateID
WHERE (t.TemplateCategoryID = categoryid OR categoryid=0)
GROUP BY TemplateID, TemplateTitle, TemplateDescription,
PreviewImage,TemplateCreatedDate
ORDER BY 
(case when paramsorting=1 then Rating when paramsorting=2 then TemplateTitle else TemplateCreatedDate end)
ASC
limit limitpage
offset offsetpage$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetTemplateCategory`()
    NO SQL
SELECT TemplateCategoryID, TemplateCategoryName
FROM TemplateCategory
ORDER BY TemplateCategoryName asc$$

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

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetUserProfile`(IN `inUserID` INT)
    NO SQL
SELECT ub.UserID, UserEmail, UserFullName, UserPhoto,
UserAddress, UserCity, UserProvince, UserCountry,
UserPostalCode, UserPhone,
PersonalUser, CompanyID, CompanyPhone,
CompanyName, CompanyAddress,CompanyCity,
CompanyProvince, CompanyCountry,
CompanyPostalCode
From UserBasic ub
LEFT JOIN company c on c.CompanyAuthor=ub.UserID
WHERE ub.UserID=inUserID AND UserStatus='A'$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `InsertContactUs`(IN `inName` VARCHAR(100), IN `inEmail` VARCHAR(50), IN `inContent` VARCHAR(500), IN `inAuthor` INT)
    NO SQL
INSERT INTO ContactUS 
(ContactUsName, ContactUsEmail, 
ContactUsContent, ContactUsAuthor)
VALUES
(inName, inEmail, inContent, inAuthor)$$

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
  `CommentID` int(11) NOT NULL,
  `Comment` text NOT NULL,
  `CommentAuthor` int(11) NOT NULL,
  `CommentStatus` char(1) NOT NULL,
  `CommentDate` datetime NOT NULL,
  `ForumID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `company`
--

CREATE TABLE IF NOT EXISTS `company` (
  `CompanyID` int(11) NOT NULL,
  `CompanyName` varchar(100) NOT NULL,
  `CompanyPhone` varchar(100) DEFAULT NULL,
  `CompanyAddress` varchar(200) DEFAULT NULL,
  `CompanyCity` varchar(50) DEFAULT NULL,
  `CompanyProvince` varchar(50) DEFAULT NULL,
  `CompanyCountry` varchar(50) DEFAULT NULL,
  `CompanyPostalCode` varchar(20) DEFAULT NULL,
  `CompanyAuthor` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `contactus`
--

CREATE TABLE IF NOT EXISTS `contactus` (
  `ContactUsID` int(11) NOT NULL,
  `ContactUsName` varchar(100) NOT NULL,
  `ContactUsEmail` varchar(50) NOT NULL,
  `ContactUsContent` varchar(500) NOT NULL,
  `ContactUsAuthor` int(11) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `contactus`
--

INSERT INTO `contactus` (`ContactUsID`, `ContactUsName`, `ContactUsEmail`, `ContactUsContent`, `ContactUsAuthor`) VALUES
(15, 'Contact 1', 'contact1@Gmail.com', 'mau tanya', 1),
(16, 'Angela Test 1', 'amuliawan93@yahoo.com', 'hai coba yuk', 1),
(17, 'angela', 'amuliawaninEmail', 'inContent', 1);

-- --------------------------------------------------------

--
-- Table structure for table `forum`
--

CREATE TABLE IF NOT EXISTS `forum` (
  `ForumID` int(11) NOT NULL,
  `ForumContent` varchar(100) NOT NULL,
  `ForumTitle` varchar(100) NOT NULL,
  `ForumAuthor` int(11) NOT NULL,
  `ForumCreatedDate` datetime NOT NULL,
  `ForumLastModified` datetime NOT NULL,
  `ForumStatus` char(1) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

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
  `ForumEyeID` int(11) NOT NULL,
  `ForumID` int(11) NOT NULL,
  `Count` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `forumhashtag`
--

CREATE TABLE IF NOT EXISTS `forumhashtag` (
  `ForumHashtagID` int(11) NOT NULL,
  `HashtagID` int(11) NOT NULL,
  `ForumID` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

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
  `HashtagID` int(11) NOT NULL,
  `Hashtag` varchar(30) NOT NULL,
  `Status` char(1) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `hashtag`
--

INSERT INTO `hashtag` (`HashtagID`, `Hashtag`, `Status`) VALUES
(1, 'FAQ', 'A'),
(2, 'StoreTutorial', 'A');

-- --------------------------------------------------------

--
-- Table structure for table `store`
--

CREATE TABLE IF NOT EXISTS `store` (
  `StoreID` int(11) NOT NULL,
  `StoreName` varchar(100) NOT NULL,
  `StoreJson` longtext NOT NULL,
  `StoreAuthor` int(11) NOT NULL,
  `PreviewImage` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `template`
--

CREATE TABLE IF NOT EXISTS `template` (
  `TemplateID` int(11) NOT NULL,
  `TemplateTitle` varchar(50) NOT NULL,
  `TemplateDescription` varchar(200) NOT NULL,
  `PreviewImage` varchar(100) NOT NULL,
  `TemplateCategoryID` int(11) NOT NULL,
  `TemplateJson` longtext NOT NULL,
  `TemplateCreatedDate` datetime NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `template`
--

INSERT INTO `template` (`TemplateID`, `TemplateTitle`, `TemplateDescription`, `PreviewImage`, `TemplateCategoryID`, `TemplateJson`, `TemplateCreatedDate`) VALUES
(1, 'Classic Wedding Invitation', 'lorem ipsum', 'wedding-image-1.jpg', 1, 'wedding-image-1.jpg', '2015-08-04 00:00:00'),
(2, 'E-Commerce 1', 'blablabla', 'wedding-image-1.jpg', 2, 'wedding-image-1.jpg', '2015-09-13 00:00:00'),
(3, 'Row 3', ' paling lama paling gaada rating', 'aaaa.jpg', 3, 'aaaa.jpg', '2015-07-01 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `templatecategory`
--

CREATE TABLE IF NOT EXISTS `templatecategory` (
  `TemplateCategoryID` int(11) NOT NULL,
  `TemplateCategoryName` varchar(50) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `templatecategory`
--

INSERT INTO `templatecategory` (`TemplateCategoryID`, `TemplateCategoryName`) VALUES
(1, 'Wedding Invitation'),
(2, 'Clothes Store'),
(3, 'Clothes Store');

-- --------------------------------------------------------

--
-- Table structure for table `templaterating`
--

CREATE TABLE IF NOT EXISTS `templaterating` (
  `TemplateRatingID` int(11) NOT NULL,
  `RatingBy` int(11) NOT NULL,
  `TemplateID` int(11) NOT NULL,
  `Rating` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `templaterating`
--

INSERT INTO `templaterating` (`TemplateRatingID`, `RatingBy`, `TemplateID`, `Rating`) VALUES
(1, 1, 1, 4),
(2, 2, 1, 3),
(3, 3, 1, 5),
(4, 1, 2, 5);

-- --------------------------------------------------------

--
-- Table structure for table `userbasic`
--

CREATE TABLE IF NOT EXISTS `userbasic` (
  `UserID` int(11) NOT NULL,
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
  `UserStatus` char(1) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `userbasic`
--

INSERT INTO `userbasic` (`UserID`, `UserEmail`, `UserFullName`, `UserPassword`, `UserPhoto`, `UserPhone`, `UserAddress`, `UserCity`, `UserProvince`, `UserCountry`, `UserPostalCode`, `PersonalUser`, `isAdministrator`, `UserStatus`) VALUES
(1, 'amuliawan93@gmail.com', 'Theresia Angela Muliawan', 'angel123', NULL, '081281849766', 'Kalipasir pengarengan 14', 'Jakarta Pusat', 'DKI Jakarta', 'Indonesia', '10340', 1, 1, 'A'),
(2, 'alexandrobrian15@gmail.com', 'Brian Alexandro Messakh', 'angelcantik', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 'A'),
(3, 'silvranz@gmail.com', 'Nicholas Gani', 'silver', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 'A');

-- --------------------------------------------------------

--
-- Table structure for table `widget`
--

CREATE TABLE IF NOT EXISTS `widget` (
  `WidgetID` int(11) NOT NULL,
  `WidgetName` varchar(50) NOT NULL,
  `WidgetDescription` text NOT NULL,
  `WidgetJson` longtext NOT NULL,
  `WidgetCategory` text NOT NULL,
  `WidgetAuthor` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `comment`
--
ALTER TABLE `comment`
  ADD PRIMARY KEY (`CommentID`),
  ADD KEY `CommentAuthor` (`CommentAuthor`),
  ADD KEY `ForumID` (`ForumID`);

--
-- Indexes for table `company`
--
ALTER TABLE `company`
  ADD PRIMARY KEY (`CompanyID`),
  ADD UNIQUE KEY `CompanyAuthor_2` (`CompanyAuthor`),
  ADD KEY `CompanyAuthor` (`CompanyAuthor`);

--
-- Indexes for table `contactus`
--
ALTER TABLE `contactus`
  ADD PRIMARY KEY (`ContactUsID`),
  ADD KEY `ContactUsAuthor` (`ContactUsAuthor`);

--
-- Indexes for table `forum`
--
ALTER TABLE `forum`
  ADD PRIMARY KEY (`ForumID`),
  ADD UNIQUE KEY `ForumAuthor` (`ForumAuthor`);

--
-- Indexes for table `forumeye`
--
ALTER TABLE `forumeye`
  ADD PRIMARY KEY (`ForumEyeID`),
  ADD KEY `ForumID` (`ForumID`);

--
-- Indexes for table `forumhashtag`
--
ALTER TABLE `forumhashtag`
  ADD PRIMARY KEY (`ForumHashtagID`),
  ADD KEY `HashtagID` (`HashtagID`,`ForumID`);

--
-- Indexes for table `hashtag`
--
ALTER TABLE `hashtag`
  ADD PRIMARY KEY (`HashtagID`);

--
-- Indexes for table `store`
--
ALTER TABLE `store`
  ADD PRIMARY KEY (`StoreID`);

--
-- Indexes for table `template`
--
ALTER TABLE `template`
  ADD PRIMARY KEY (`TemplateID`),
  ADD KEY `TemplateCategoryID` (`TemplateCategoryID`);

--
-- Indexes for table `templatecategory`
--
ALTER TABLE `templatecategory`
  ADD PRIMARY KEY (`TemplateCategoryID`);

--
-- Indexes for table `templaterating`
--
ALTER TABLE `templaterating`
  ADD PRIMARY KEY (`TemplateRatingID`),
  ADD KEY `RatingBy` (`RatingBy`,`TemplateID`),
  ADD KEY `TemplateID` (`TemplateID`);

--
-- Indexes for table `userbasic`
--
ALTER TABLE `userbasic`
  ADD PRIMARY KEY (`UserID`),
  ADD UNIQUE KEY `UserEmail` (`UserEmail`);

--
-- Indexes for table `widget`
--
ALTER TABLE `widget`
  ADD PRIMARY KEY (`WidgetID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `comment`
--
ALTER TABLE `comment`
  MODIFY `CommentID` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `company`
--
ALTER TABLE `company`
  MODIFY `CompanyID` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `contactus`
--
ALTER TABLE `contactus`
  MODIFY `ContactUsID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=18;
--
-- AUTO_INCREMENT for table `forum`
--
ALTER TABLE `forum`
  MODIFY `ForumID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `forumeye`
--
ALTER TABLE `forumeye`
  MODIFY `ForumEyeID` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `forumhashtag`
--
ALTER TABLE `forumhashtag`
  MODIFY `ForumHashtagID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `hashtag`
--
ALTER TABLE `hashtag`
  MODIFY `HashtagID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `store`
--
ALTER TABLE `store`
  MODIFY `StoreID` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `template`
--
ALTER TABLE `template`
  MODIFY `TemplateID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `templatecategory`
--
ALTER TABLE `templatecategory`
  MODIFY `TemplateCategoryID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `templaterating`
--
ALTER TABLE `templaterating`
  MODIFY `TemplateRatingID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `userbasic`
--
ALTER TABLE `userbasic`
  MODIFY `UserID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `widget`
--
ALTER TABLE `widget`
  MODIFY `WidgetID` int(11) NOT NULL AUTO_INCREMENT;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `comment`
--
ALTER TABLE `comment`
  ADD CONSTRAINT `comment_ibfk_1` FOREIGN KEY (`CommentAuthor`) REFERENCES `userbasic` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comment_ibfk_2` FOREIGN KEY (`ForumID`) REFERENCES `forum` (`ForumID`) ON DELETE CASCADE ON UPDATE CASCADE;

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
  ADD CONSTRAINT `templaterating_ibfk_1` FOREIGN KEY (`RatingBy`) REFERENCES `userbasic` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `templaterating_ibfk_2` FOREIGN KEY (`TemplateID`) REFERENCES `template` (`TemplateID`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
