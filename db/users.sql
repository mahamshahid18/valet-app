-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 11, 2017 at 04:43 PM
-- Server version: 5.7.14
-- PHP Version: 5.6.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `valetapp`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `full_name` varchar(255) NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `car_reg_no` varchar(10) NOT NULL,
  `car_color` varchar(20) NOT NULL,
  `car_model_make` varchar(50) NOT NULL COMMENT 'example: honda city(model is city, make is honda)',
  `ticket_no` varchar(255) NOT NULL,
  `payment_status` int(11) NOT NULL DEFAULT '0' COMMENT '0 means not paid, 1 means paid',
  `amount_to_be_paid` int(11) NOT NULL COMMENT 'Amount in $'
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`full_name`, `phone_number`, `car_reg_no`, `car_color`, `car_model_make`, `ticket_no`, `payment_status`, `amount_to_be_paid`) VALUES
('Maham Shahid', '+923025130350', 'IDL7743', 'Golden', 'Honda City', '0IDL7743', 0, 5),
('test', '1234567', 'abc123', 'golden', 'honda', '1abc123', 1, 5),
('"MS"', '+923025130350', 'RIY331', 'Gray', 'Daewoo Racer', '2RIY331', 0, 5),
('asdsadad', '12214343', 'asdasdad', '', 'asdas', '3asdasdad', 1, 5),
('Testing from phone', '+923025130350', 'Hahshsbs', '', 'Bsbshshs', '4Hahshsbs', 0, 5);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`ticket_no`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
