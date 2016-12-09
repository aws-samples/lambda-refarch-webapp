package blog.posts.handlers;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.lambda.runtime.RequestStreamHandler;
import com.fasterxml.jackson.databind.ObjectMapper;

import blog.configuration.ApplicationConfiguration;
import blog.configuration.ApplicationConfigurationStore;
import blog.posts.models.FindPostRequest;
import blog.posts.models.Post;
import blog.posts.repositories.DynamoDBPostRepository;

public class FindPost implements RequestStreamHandler {

    private ApplicationConfigurationStore applicationConfigurationStore = new ApplicationConfigurationStore();

    @Override
    public void handleRequest(InputStream input, OutputStream output, Context context) throws IOException {
        LambdaLogger logger = context.getLogger();
        ObjectMapper mapper = new ObjectMapper();
        FindPostRequest request = mapper.readValue(input, FindPostRequest.class);
        logger.log("request:\n" + request + "\n");

        ApplicationConfiguration applicationConfiguration = applicationConfigurationStore
                .getApplicationConfiguration(request.getRequestConfiguration());
        logger.log("applicationConfiguration:\n" + applicationConfiguration + "\n");

        DynamoDBPostRepository postRepo = new DynamoDBPostRepository(applicationConfiguration);
        Post post = postRepo.findOne(request.getForumId(),request.getId());
        logger.log("post:\n" + post + "\n");

        mapper.writeValue(output, post);
    }
}