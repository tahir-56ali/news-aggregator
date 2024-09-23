
# News Aggregator
 
This project is a News Aggregator website built with a Laravel backend and a React frontend. You can run the project in both development and production modes using Docker.
  
## Development Mode
  
### Steps to Build for Development Mode:
    
1. Open a terminal, navigate to the folder where you want to set up the project, and run the following command to clone the repository: git clone https://github.com/tahir-56ali/news-aggregator.git news-aggregator
2. Navigate to the project directory: cd news-aggregator 
3. Build and start the Docker containers: docker-compose -f docker-compose.dev.yml up --build
4. Open a new terminal and access the PHP container: docker exec -it laravel-app /bin/sh
5. Run the following command to apply database migrations: php artisan migrate
6. To fetch some initial articles into the database, run: php artisan app:fetch-all-sources-articles
7. Access the News Aggregator website in your browser at: http://localhost

## Production Mode
  
### Steps to Build for Production Mode:
    
1. (Optional - if not already done) Open a terminal, navigate to the folder where you want to set up the project, and run the following command to clone the repository: git clone https://github.com/tahir-56ali/news-aggregator.git news-aggregator
2. Navigate to the project directory: cd news-aggregator 
3. Build and start the Docker containers: docker-compose -f docker-compose.prod.yml up --build
4. (Optional - if not already run the migrations) Open a new terminal and access the PHP container: docker exec -it laravel-app /bin/sh
5. (Optional - if not already done) Run the following command to apply database migrations: php artisan migrate
6. (Optional - if not already done) To fetch some initial articles into the database, run: php artisan app:fetch-all-sources-articles
7. Access the News Aggregator website in your browser at: http://localhost