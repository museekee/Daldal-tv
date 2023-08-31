-- --------------------------------------------------------
-- 호스트:                          127.0.0.1
-- 서버 버전:                        10.9.2-MariaDB - mariadb.org binary distribution
-- 서버 OS:                        Win64
-- HeidiSQL 버전:                  11.3.0.6295
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- 테이블 daldaltv.comments 구조 내보내기
CREATE TABLE IF NOT EXISTS `comments` (
  `VID` text NOT NULL,
  `PROVIDER` text NOT NULL,
  `LIKES` int(11) NOT NULL DEFAULT 0,
  `DISLIKES` int(11) NOT NULL DEFAULT 0,
  `CONTENT` mediumtext NOT NULL,
  `TIME` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 daldaltv.dislikes 구조 내보내기
CREATE TABLE IF NOT EXISTS `dislikes` (
  `VID` mediumtext NOT NULL,
  `UID` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 daldaltv.likes 구조 내보내기
CREATE TABLE IF NOT EXISTS `likes` (
  `VID` mediumtext NOT NULL,
  `UID` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 daldaltv.other_videos 구조 내보내기
CREATE TABLE IF NOT EXISTS `other_videos` (
  `ID` text NOT NULL,
  `LOCATION` text NOT NULL,
  `THUMBNAIL` text NOT NULL,
  `NAME` text NOT NULL,
  PRIMARY KEY (`ID`(100))
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 daldaltv.sessions 구조 내보내기
CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 daldaltv.subscribes 구조 내보내기
CREATE TABLE IF NOT EXISTS `subscribes` (
  `TARGET` text NOT NULL,
  `SUBSCRIBER` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 daldaltv.users 구조 내보내기
CREATE TABLE IF NOT EXISTS `users` (
  `ID` text NOT NULL,
  `EMAIL` mediumtext NOT NULL,
  `NICK` text NOT NULL,
  `PROFILE_PIC` mediumtext DEFAULT NULL,
  `ABOUT_ME` mediumtext NOT NULL DEFAULT '',
  PRIMARY KEY (`ID`(100))
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 daldaltv.videos 구조 내보내기
CREATE TABLE IF NOT EXISTS `videos` (
  `ID` text NOT NULL,
  `TITLE` text NOT NULL,
  `DESCRIPTION` text NOT NULL,
  `UPLOADED_AT` datetime NOT NULL,
  `PROVIDER` text NOT NULL,
  `VIEWS` int(11) NOT NULL DEFAULT 0,
  `LIKES` int(11) NOT NULL DEFAULT 0,
  `DISLIKES` int(11) NOT NULL DEFAULT 0,
  `VISIBILITY` mediumtext NOT NULL DEFAULT 'Public',
  `TYPE` text NOT NULL,
  PRIMARY KEY (`ID`(100))
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

-- 내보낼 데이터가 선택되어 있지 않습니다.

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
