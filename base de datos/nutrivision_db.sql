CREATE DATABASE  IF NOT EXISTS `nutrivision` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `nutrivision`;
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: nutrivision
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `consumo_diario`
--

DROP TABLE IF EXISTS `consumo_diario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `consumo_diario` (
  `consumo_id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int DEFAULT NULL,
  `fecha` date DEFAULT (curdate()),
  `calorias` int DEFAULT '0',
  `proteinas_g` int DEFAULT '0',
  `carbohidratos_g` int DEFAULT '0',
  `grasas_g` int DEFAULT '0',
  `nombre_alimento` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`consumo_id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `consumo_diario_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`usuario_id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `consumo_diario`
--

LOCK TABLES `consumo_diario` WRITE;
/*!40000 ALTER TABLE `consumo_diario` DISABLE KEYS */;
INSERT INTO `consumo_diario` VALUES (1,8,'2026-04-25',342,30,20,16,'Ensalada Mixta con Pollo y Aderezo Cremoso'),(2,8,'2026-04-25',250,20,18,12,'Taco de Carne (por unidad)'),(3,8,'2026-04-25',380,30,25,28,'Ensalada de Pollo y Verduras con Aderezo Cremoso'),(4,8,'2026-04-25',800,55,65,40,'Sándwich de atún (2 unidades)'),(5,8,'2026-04-25',250,0,1,27,'Salsa de mayonesa'),(6,8,'2026-04-25',190,13,17,8,'Taco al Pastor'),(7,8,'2026-04-25',165,31,0,4,'Pollo desmenuzado'),(8,8,'2026-04-25',10,1,2,0,'Lechuga picada'),(9,8,'2026-04-25',54,2,12,1,'Maíz dulce (granos)'),(10,8,'2026-04-25',33,2,6,0,'Guisantes (arvejas)'),(11,8,'2026-04-25',12,0,3,0,'Zanahoria picada'),(12,8,'2026-04-25',325,0,1,35,'Aderezo cremoso (tipo mayonesa)'),(13,8,'2026-04-25',310,28,34,11,'Sándwich de ensalada de atún con pan integral'),(14,8,'2026-04-25',150,1,5,15,'Salsa cremosa para untar'),(15,9,'2026-04-25',220,7,35,9,'Tortitas'),(16,9,'2026-04-25',20,0,5,0,'Arándanos'),(17,9,'2026-04-25',10,0,3,0,'Cerezas'),(18,9,'2026-04-25',105,1,27,0,'Plátano'),(19,9,'2026-04-25',380,31,20,24,'Pollo en mole'),(20,9,'2026-04-25',205,4,45,1,'Arroz blanco'),(21,9,'2026-04-25',120,3,27,1,'Cereal de hojuelas (flakes)'),(22,9,'2026-04-25',150,8,12,8,'Leche entera'),(23,10,'2026-04-25',350,30,18,18,'Pollo con Mole'),(24,10,'2026-04-25',205,4,45,0,'Arroz Blanco'),(25,10,'2026-04-25',560,54,0,36,'Costillas de Res Asadas'),(26,10,'2026-04-25',320,22,6,26,'Salchichas Asadas'),(27,10,'2026-04-25',130,3,26,2,'Tortillas de Maíz Asadas'),(28,10,'2026-04-25',400,18,34,23,'Quesadillas de queso'),(29,8,'2026-04-25',750,35,62,38,'Quesadilla de queso'),(30,13,'2026-04-25',580,28,52,28,'Quesadillas de queso');
/*!40000 ALTER TABLE `consumo_diario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `foto_comida`
--

DROP TABLE IF EXISTS `foto_comida`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `foto_comida` (
  `foto_id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `url` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `formato` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `resolucion` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tomada_en` datetime DEFAULT CURRENT_TIMESTAMP,
  `anotaciones` text COLLATE utf8mb4_unicode_ci,
  `estado_revision` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'Pendiente',
  `revisado_por` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `revisado_en` datetime DEFAULT NULL,
  `comentarios_revision` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`foto_id`),
  KEY `idx_foto_usuario` (`usuario_id`),
  CONSTRAINT `foto_comida_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`usuario_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `foto_comida`
--

LOCK TABLES `foto_comida` WRITE;
/*!40000 ALTER TABLE `foto_comida` DISABLE KEYS */;
/*!40000 ALTER TABLE `foto_comida` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `platillo_alimento`
--

DROP TABLE IF EXISTS `platillo_alimento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `platillo_alimento` (
  `platillo_id` int NOT NULL AUTO_INCREMENT,
  `detectado_id` int NOT NULL,
  `nombre_platillo` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `porcion` float DEFAULT NULL,
  `unidad_porcion` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `energia_kcal` decimal(10,2) DEFAULT NULL,
  `proteina_g` decimal(10,2) DEFAULT NULL,
  `carbohidratos_g` decimal(10,2) DEFAULT NULL,
  `grasa_total_g` decimal(10,2) DEFAULT NULL,
  `fibra_g` decimal(10,2) DEFAULT NULL,
  `azucar_g` decimal(10,2) DEFAULT NULL,
  `sodio_mg` decimal(10,2) DEFAULT NULL,
  `potasio_mg` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`platillo_id`),
  KEY `detectado_id` (`detectado_id`),
  CONSTRAINT `platillo_alimento_ibfk_1` FOREIGN KEY (`detectado_id`) REFERENCES `registro_comida` (`detectado_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `platillo_alimento`
--

LOCK TABLES `platillo_alimento` WRITE;
/*!40000 ALTER TABLE `platillo_alimento` DISABLE KEYS */;
/*!40000 ALTER TABLE `platillo_alimento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `platillo_guardado`
--

DROP TABLE IF EXISTS `platillo_guardado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `platillo_guardado` (
  `guardado_id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `platillo_id` int NOT NULL,
  `nombre` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`guardado_id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `platillo_id` (`platillo_id`),
  CONSTRAINT `platillo_guardado_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`usuario_id`) ON DELETE CASCADE,
  CONSTRAINT `platillo_guardado_ibfk_2` FOREIGN KEY (`platillo_id`) REFERENCES `platillo_alimento` (`platillo_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `platillo_guardado`
--

LOCK TABLES `platillo_guardado` WRITE;
/*!40000 ALTER TABLE `platillo_guardado` DISABLE KEYS */;
/*!40000 ALTER TABLE `platillo_guardado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recomendacion`
--

DROP TABLE IF EXISTS `recomendacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recomendacion` (
  `recomendacion_id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `tipo` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `titulo` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `detalle` text COLLATE utf8mb4_unicode_ci,
  `creada_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `vigente_hasta` date DEFAULT NULL,
  PRIMARY KEY (`recomendacion_id`),
  KEY `idx_recom_usuario` (`usuario_id`),
  CONSTRAINT `recomendacion_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`usuario_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recomendacion`
--

LOCK TABLES `recomendacion` WRITE;
/*!40000 ALTER TABLE `recomendacion` DISABLE KEYS */;
/*!40000 ALTER TABLE `recomendacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `registro_comida`
--

DROP TABLE IF EXISTS `registro_comida`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `registro_comida` (
  `detectado_id` int NOT NULL AUTO_INCREMENT,
  `foto_id` int NOT NULL,
  `usuario_id` int NOT NULL,
  `etiqueta_general` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `categoria_alimento` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `confianza` float DEFAULT NULL,
  `cantidad_estimada` float DEFAULT NULL,
  `unidad` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notas` text COLLATE utf8mb4_unicode_ci,
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`detectado_id`),
  KEY `foto_id` (`foto_id`),
  KEY `idx_registro_usuario` (`usuario_id`),
  KEY `idx_registro_fecha` (`creado_en`),
  CONSTRAINT `registro_comida_ibfk_1` FOREIGN KEY (`foto_id`) REFERENCES `foto_comida` (`foto_id`) ON DELETE CASCADE,
  CONSTRAINT `registro_comida_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`usuario_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `registro_comida`
--

LOCK TABLES `registro_comida` WRITE;
/*!40000 ALTER TABLE `registro_comida` DISABLE KEYS */;
/*!40000 ALTER TABLE `registro_comida` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sesion`
--

DROP TABLE IF EXISTS `sesion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sesion` (
  `sesion_id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `creada_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `expira_en` datetime NOT NULL,
  `activa` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`sesion_id`),
  UNIQUE KEY `token` (`token`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `sesion_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`usuario_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sesion`
--

LOCK TABLES `sesion` WRITE;
/*!40000 ALTER TABLE `sesion` DISABLE KEYS */;
/*!40000 ALTER TABLE `sesion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `usuario_id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellido` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `correo` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `sexo` enum('Masculino','Femenino','Otro') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `altura_cm` float DEFAULT NULL,
  `peso_kg` float DEFAULT NULL,
  `objetivo` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `actividad_fisica` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alergias` text COLLATE utf8mb4_unicode_ci,
  `restricciones` text COLLATE utf8mb4_unicode_ci,
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `actualizado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `racha_inicial` int DEFAULT '0',
  `estado_inicial` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'Estable',
  `tiene_diabetes` varchar(2) COLLATE utf8mb4_unicode_ci DEFAULT 'no',
  `tipo_diabetes` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`usuario_id`),
  UNIQUE KEY `correo` (`correo`),
  KEY `idx_correo` (`correo`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'Jorge','López','jorge@gmail.com','$2a$10$2skUF9jAoVa7CJfvpxD4leqqVc6oRoUKs4/.8XvyHXBulk1OCdLmi','2000-08-23','Masculino',175,80,NULL,NULL,NULL,NULL,'2026-04-24 23:09:57','2026-04-24 23:09:57',0,'Estable','no',NULL),(2,'Javier','Gómez','javier@gmail.com','$2a$10$kMyIXs3khJL/jHe7P5FcJOONHV0tB4/rCBCXJhZyqpW.rgh3E1pbK','2001-08-23','Masculino',180,85,NULL,NULL,NULL,NULL,'2026-04-24 23:18:25','2026-04-24 23:18:25',0,'Estable','no',NULL),(3,'Francisco','Martinez','francisco@gmail.com','$2a$10$DmeexpRGSoajI4wcuCEncehQb8QyIDsoKqh5ydK50PBLzUIwW1Wyy','2006-09-23','Masculino',174,68,NULL,NULL,NULL,NULL,'2026-04-24 23:24:53','2026-04-24 23:24:53',0,'Estable','no',NULL),(4,'Guadalupe','Sánchez','guadalupe@gmail.com','$2a$10$UHuxRx/.sZni8vVKI001.OJTvxKu1Cf53Ntnc1vIYqLGZtMScixCa','1998-08-25','Femenino',160,50,NULL,NULL,NULL,NULL,'2026-04-24 23:30:09','2026-04-24 23:30:09',0,'Estable','no',NULL),(5,'Federico','González','federico@gmail.com','$2a$10$Sg.PoP8JJWNgORHySVS0fuUmiR50X7Vdz0GkR7PrePVbC9RqAE86i','1994-07-25','Masculino',178,80,'Bajar peso',NULL,NULL,NULL,'2026-04-24 23:52:29','2026-04-24 23:52:29',0,'Saludable','no',NULL),(6,'Mariam','Pérez','mariam@gmail.com','$2a$10$B1/3v3qseK4s4r8ePVGibOontbjHCoKrwBHibtwFvRNGLKJllbNwS','2005-08-23','Femenino',158,50,'Bajar peso',NULL,NULL,NULL,'2026-04-25 00:04:21','2026-04-25 00:04:21',0,'Saludable','no',NULL),(7,'Romina','Arriaga','romina@gmail.com','$2a$10$oeqMm6FwP9/2LdDVb9Acve/cSKaVxofXrHYwUvi8N.8D/8XZ6Mt6y','2000-08-25','Femenino',167,58,'Bajar peso',NULL,NULL,NULL,'2026-04-25 00:08:12','2026-04-25 00:08:12',0,'Saludable','si','Tipo 2'),(8,'Armando','Gonzalez','armando@gmail.com','$2a$10$Mj6PfJSz27N0lGWtLQa6.us/WnAwKUl3.hl/c8ua6JjUcgaaOPjLu','1995-07-28','Masculino',180,80,'Bajar peso',NULL,NULL,NULL,'2026-04-25 00:09:07','2026-04-25 00:09:07',0,'Mal','si','Pre.Diabetes'),(9,'Ernesto','Cables','ernesto@gmail.com','$2a$10$EX5R6UooIHQ9IhmT4ahaoe57FYwmaddEvWYWVYP7uWKGnk/LlNhcS','1992-08-25','Masculino',180,70,'Buena salud',NULL,NULL,NULL,'2026-04-25 19:49:43','2026-04-25 19:49:43',0,'Saludable','si','Tipo 1'),(10,'Mariela','Almaraz','mariela@gmail.com','$2a$10$pQp9mwJOrYW.D8QT7SeV..vZDE7PrXuS/7BPt4QF5uTuLleTyda..','1996-08-25','Femenino',163,53,'Bajar peso',NULL,NULL,NULL,'2026-04-25 19:58:38','2026-04-25 19:58:38',0,'Saludable','si','Tipo 1'),(11,'Shah','Shush’s','zvsvvshs','$2a$10$Hci5AZSawe08c3R74NLShOxAxkkoDTt92zx3QFkMWtHF3kggRDHD2',NULL,'Femenino',169,5,'Abaja',NULL,NULL,NULL,'2026-04-25 20:06:21','2026-04-25 20:06:21',0,'Jajaja','no',NULL),(12,'Isabela','Pérez','isabela@gmail.com','$2a$10$XN6nB7EB9Ni9LtTiFtP30uhMAdWQZrucjvBqOVSUlpV8C4giToLxS','2000-08-25','Femenino',153,60,'Control de presión',NULL,NULL,NULL,'2026-04-25 20:24:56','2026-04-25 20:24:56',0,'En tratamiento','si','Tipo 1'),(13,'Alfonso','Herrera','alfonso@gmail.com','$2a$10$CwZpy02EWO8JLiKMqRro0eqoULCRsEbbkJJPBEx2Ei7r5vk77EzT6','2005-08-23','Masculino',165,62,'Mantener peso',NULL,NULL,NULL,'2026-04-25 23:28:07','2026-04-25 23:28:07',0,'En tratamiento','no',NULL),(14,'Francisco','Martínez','franciscomtz060906@gmail.com','$2a$10$Tzf3EqwB3JDryn.zVeRt9ulHkuSneQHuC8zLFh3O6wL9SD5nUzDTi','2006-09-23','Masculino',174,68,'Ganar músculo',NULL,NULL,NULL,'2026-04-25 23:42:33','2026-04-25 23:42:33',0,'Saludable','no',NULL),(15,'Alexis','Montaña','alexis@gmail.com','$2a$10$DIXCZFNIVPBd54xU8NnlgesnxVrKupOaZh55iZnv9EU6KdpH28WeS','2008-09-23','Masculino',170,48,'Ganar músculo',NULL,NULL,NULL,'2026-04-26 00:09:45','2026-04-26 00:09:45',0,'Controlado','no',NULL),(16,'Tania','Garvia','tania@gmail.com','$2a$10$eyebHbEyeH4oyWXQl/0u4uqKQVM1.mUMO2gVPZPpe6k/2mQvHx3pm','1995-08-23','Femenino',158,60,'Bajar de peso',NULL,NULL,NULL,'2026-04-26 00:17:39','2026-04-26 00:17:39',0,'Saludable','no',NULL);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario_condicion`
--

DROP TABLE IF EXISTS `usuario_condicion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario_condicion` (
  `usuario_condicion_id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `nombre_condicion` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `severidad` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tratamiento` text COLLATE utf8mb4_unicode_ci,
  `diagnosticado_en` date DEFAULT NULL,
  `estado` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'Activa',
  PRIMARY KEY (`usuario_condicion_id`),
  KEY `idx_condicion_usuario` (`usuario_id`),
  CONSTRAINT `usuario_condicion_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`usuario_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario_condicion`
--

LOCK TABLES `usuario_condicion` WRITE;
/*!40000 ALTER TABLE `usuario_condicion` DISABLE KEYS */;
INSERT INTO `usuario_condicion` VALUES (1,1,'Diabetes Tipo 1',NULL,NULL,NULL,'Activa'),(2,2,'Diabetes Tipo 2',NULL,NULL,NULL,'Activa'),(3,3,'Diabetes Tipo 1',NULL,NULL,NULL,'Activa'),(4,4,'Diabetes Tipo 1',NULL,NULL,NULL,'Activa'),(5,5,'Diabetes Tipo 2',NULL,NULL,NULL,'Activa'),(6,6,'Diabetes Gestacional',NULL,NULL,NULL,'Activa'),(7,7,'Diabetes Tipo 2',NULL,NULL,NULL,'Activa'),(8,8,'Diabetes Pre.Diabetes',NULL,NULL,NULL,'Activa'),(9,9,'Diabetes Tipo 1',NULL,NULL,NULL,'Activa'),(10,10,'Diabetes Tipo 1',NULL,NULL,NULL,'Activa'),(11,12,'Diabetes Tipo 1',NULL,NULL,NULL,'Activa');
/*!40000 ALTER TABLE `usuario_condicion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'nutrivision'
--

--
-- Dumping routines for database 'nutrivision'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-25 18:27:24
