package blog.comments.handlers;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.lambda.runtime.RequestStreamHandler;
import com.fasterxml.jackson.databind.ObjectMapper;

import blog.comments.models.Comment;
import blog.comments.models.FindCommentRequest;
import blog.comments.repositories.DynamoDBCommentRepository;
import blog.configuration.ApplicationConfiguration;
import blog.configuration.ApplicationConfigurationStore;

public class FindComment implements RequestStreamHandler {

    private ApplicationConfigurationStore applicationConfigurationStore = new ApplicationConfigurationStore();

    @Override
    public void handleRequest(InputStream input, OutputStream output, Context context) throws IOException {
        LambdaLogger logger = context.getLogger();
        ObjectMapper mapper = new ObjectMapper();
        FindCommentRequest request = mapper.readValue(input, FindCommentRequest.class);
        logger.log("request:\n" + request + "\n");

        ApplicationConfiguration applicationConfiguration = applicationConfigurationStore
                .getApplicationConfiguration(request.getRequestConfiguration());
        logger.log("applicationConfiguration:\n" + applicationConfiguration + "\n");

        DynamoDBCommentRepository commentRepo = new DynamoDBCommentRepository(applicationConfiguration);
        Comment comment = commentRepo.findComment(request.getPostId(), request.getDate());
        logger.log("comment:\n" + comment + "\n");

        mapper.writeValue(output, comment);
    }
}