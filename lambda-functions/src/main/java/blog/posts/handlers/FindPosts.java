package blog.posts.handlers;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.List;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.lambda.runtime.RequestStreamHandler;
import com.fasterxml.jackson.databind.ObjectMapper;

import blog.configuration.ApplicationConfiguration;
import blog.configuration.ApplicationConfigurationStore;
import blog.posts.models.FindPostsRequest;
import blog.posts.models.LatestPostByForum;
import blog.posts.models.Post;
import blog.posts.repositories.DynamoDBPostRepository;
import com.amazonaws.services.lambda.runtime.RequestHandler;

public class FindPosts implements RequestHandler <FindPostsRequest, List<LatestPostByForum>>{

    private ApplicationConfigurationStore applicationConfigurationStore = new ApplicationConfigurationStore();

	@Override
    public List<LatestPostByForum> handleRequest(FindPostsRequest request, Context context){
        LambdaLogger logger = context.getLogger();
        //ObjectMapper mapper = new ObjectMapper();
      //  FindPostRequest request = mapper.readValue(input, FindPostRequest.class);
        logger.log("request:\n" + request + "\n");
logger.log("requestconfig: " + request.getConfig());
        ApplicationConfiguration applicationConfiguration = applicationConfigurationStore
                .getApplicationConfiguration(request.getConfig());
        logger.log("applicationConfiguration:\n" + applicationConfiguration + "\n");

		DynamoDBPostRepository postRepo = new DynamoDBPostRepository(applicationConfiguration);
        return postRepo.findPosts(request.getForumId());
        //logger.log("posts:\n" + posts + "\n");

        //mapper.writeValue(output, posts);
	}
}
