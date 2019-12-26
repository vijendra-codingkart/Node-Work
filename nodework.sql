-- phpMyAdmin SQL Dump
-- version 4.8.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 25, 2019 at 03:41 PM
-- Server version: 10.1.37-MariaDB
-- PHP Version: 5.6.39

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `nodework`
--

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

CREATE TABLE `questions` (
  `id` int(11) NOT NULL,
  `question_name` varchar(999) NOT NULL,
  `question_time` varchar(40) NOT NULL,
  `question_hint` varchar(999) NOT NULL,
  `create_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` int(11) NOT NULL DEFAULT '1',
  `question_type` varchar(255) NOT NULL DEFAULT '1',
  `option_a` varchar(255) NOT NULL,
  `option_b` varchar(255) NOT NULL,
  `option_c` varchar(255) NOT NULL,
  `option_d` varchar(255) NOT NULL,
  `option_e` varchar(255) NOT NULL,
  `answer` varchar(255) NOT NULL,
  `more_questions` varchar(999) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `questions`
--

INSERT INTO `questions` (`id`, `question_name`, `question_time`, `question_hint`, `create_date`, `status`, `question_type`, `option_a`, `option_b`, `option_c`, `option_d`, `option_e`, `answer`, `more_questions`) VALUES
(4, 'sasa', '00:01:00', 'sas', '2019-12-20 10:59:47', 1, '2', 'sas', 'saa', 'ee', 'ee', 'ee', 'C', ''),
(6, 'sasa', '00:00:20', 'as', '2019-12-20 18:44:32', 1, '1', 'sas', 'as', 'sas', 'sass', 'sa', 'A', '[\"sas1\",\"asas2\"]'),
(7, 'wqw', '00:1:10', 'sas', '2019-12-20 19:59:51', 1, '2', 'ssa', 'asas', 'sas', '', '', 'B,C', ''),
(8, 'Test Q', '00:01:50', 'Test hint', '2019-12-23 17:55:19', 1, '2', 'Test Q1', 'Test Q2', 'Test Q3', 'Test Q4', 'Test Q5', 'B,C,D', '[\"Test Q6\",\"Test Q7\"]'),
(9, 'Question testing', '00:01:04', 's', '2019-12-25 17:47:22', 1, '1', 'A', 'B', '', '', '', 'B', '');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `user_role` varchar(255) NOT NULL,
  `status` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `user_role`, `status`) VALUES
(2, 'admin', 'admin@admin.com', 'admin@admin.com', 'admin', 1),
(3, 'ghjghj', 'nayan1@test.com', 'nayan@test.com', 'user', 1),
(4, 'ramji', 'ramji@codingkart.com', 'ramji@codingkart.com', 'user', 1),
(5, 'vijendra', 'vr@admin.com', 'vr@admin.com', 'admin', 1),
(6, 'vije', 'vije@gmail.com', 'vije@gmail.com', 'user', 0),
(7, 'saikat sarkar', 'sa@dd.fgfg', 'sa@dd.fgfg', 'user', 0);

-- --------------------------------------------------------

--
-- Table structure for table `users_result`
--

CREATE TABLE `users_result` (
  `id` int(11) NOT NULL,
  `user_id` bigint(11) NOT NULL,
  `correct_ans` bigint(11) NOT NULL,
  `total_answer` varchar(11) NOT NULL,
  `attempt_ques` bigint(11) NOT NULL,
  `status` int(4) NOT NULL DEFAULT '1',
  `create_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users_result`
--

INSERT INTO `users_result` (`id`, `user_id`, `correct_ans`, `total_answer`, `attempt_ques`, `status`, `create_date`) VALUES
(60, 6, 1, '5', 5, 1, '2019-12-25 20:07:11');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users_result`
--
ALTER TABLE `users_result`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `questions`
--
ALTER TABLE `questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users_result`
--
ALTER TABLE `users_result`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
