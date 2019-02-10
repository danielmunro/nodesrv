# install ecs-deploy
curl https://raw.githubusercontent.com/silinternational/ecs-deploy/master/ecs-deploy | \
  sudo tee -a /usr/bin/ecs-deploy
sudo chmod +x /usr/bin/ecs-deploy

# login AWS ECR
eval $(aws ecr get-login --region us-west-2)

# build the docker image and push to an image repository
docker build -t nodesrv-app .
docker tag nodesrv-app:latest $IMAGE_REPO
docker push $IMAGE_REPO

# update an AWS ECS service with the new image
ecs-deploy -c nodesrv-app -n app-2 -i $IMAGE_REPO
