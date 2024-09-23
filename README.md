
# News Aggregator
 
This project is a News Aggregator website built with a Laravel backend and a React frontend. You can run the project in both development and production modes using Docker.
  
## Development Mode
  
### Steps to Build for Development Mode:
    
1. Clone the repository: git clone https://github.com/tahir-56ali/news-aggregator.git news-aggregator
2. Build and start the Docker containers (inside news-aggregator directory): docker-compose -f docker-compose.dev.yml up --build
3. Open a terminal and access the PHP container: docker exec -it laravel-app /bin/sh
4. Inside the PHP container, run the following command to apply database migrations: php artisan migrate
5. Inside the PHP container, To fetch some initial articles into the database, run: php artisan app:fetch-all-sources-articles
6. Access the News Aggregator website in your browser at: http://localhost

## Production Mode
  
### Steps to Build for Production Mode:
    
1. (Optional - if not already done) Clone the repository: git clone https://github.com/tahir-56ali/news-aggregator.git news-aggregator
2. Build and start the Docker containers (inside news-aggregator directory): docker-compose -f docker-compose.prod.yml up --build
3. (Optional - if not already run the migrations) Open a terminal and access the PHP container: docker exec -it laravel-app /bin/sh
4. (Optional - if not already done) Inside the PHP container, run the following command to apply database migrations: php artisan migrate
5. (Optional - if not already done) Inside the PHP container, To fetch some initial articles into the database, run: php artisan app:fetch-all-sources-articles
6. Access the News Aggregator website in your browser at: http://localhost