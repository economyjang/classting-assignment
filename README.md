# classting-assignment

1. 사용기술
   * NestJs
   * Typescript
   * Typeorm
   * Mysql 8.0.35
   * Swagger

2. Swagger 를 확인할 수 있는 URL
   * http://localhost:3000/api

3. 데이터베이스 정보
   * Database: mysql

   * host: 'localhost'
   * port: 3306
   * username: 'root'
   * password: 'root'
   * database: 'classting_test'

4. 데이터베이스 초기 설정
   1) mysql 접속 (초기 설치후 패스워드가 없다면 'Enter')
      ```
      mysql -u root -p
      ```
   2) 패스워드 설정
      ```
      ALTER USER 'root'@'localhost' IDENTIFIED BY 'root';
      ```
   3) 데이터베이스 생성
      ```
      CREATE DATABASE classting_test;
      ```
   4) 데이터베이스 생성 확인
      ```
      SHOW DATABASES;
      ```

5. 프로젝트 실행 방법
   1) 프로젝트 라이브러리 설치
      ```
      npm install 
      ```
   2) 프로젝트 빌드
      ```
      npm run build
      ```

   3) 프로젝트 시작
      ```
      npm run start
      ``` 

   4) 테스트
      ```
      npm run test
      ```
      
