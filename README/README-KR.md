# 서버 없는 레퍼런스 아키텍처: 웹 애플리케이션

API 요청을 인증 및 처리하기 위해 [AWS Lambda](http://aws.amazon.com/lambda/) 및 Amazon API Gateway를 사용하여 동적 웹 애플리케이션을 구축하는 방법을 보여주는 서버 없는 레퍼런스 아키텍처입니다.

AWS Lambda와 다른 AWS 서비스를 결합하여 개발자는 확장, 백업 또는 다중 데이터 센터 중복성을 위해 필요한 관리 작업 없이 자동으로 확장/축소되고 여러 데이터 센터 간에 고가용성 구성을 실행할 수 있는 강력한 웹 애플리케이션을 구축할 수 있습니다.

이 예제에서는 AWS Lambda 및 Amazon API Gateway를 사용하여 SMS를 통해 투표를 진행하고, Amazon DynamoDB에 합계를 집계하고, Amazon Simple Storage Service(Amazon S3)를 사용하여 결과를 실시간으로 보여주는 동적 투표 애플리케이션을 구축하는 방법을 살펴봅니다.

이 [diagram](https://s3.amazonaws.com/awslambda-reference-architectures/web-app/lambda-refarch-webapp.pdf)에 설명된 아키텍처는 AWS CloudFormation 템플릿을 사용하여 만들 수 있습니다.

[The template](https://s3.amazonaws.com/awslambda-reference-architectures/web-app/lambda_webapp.template)으로 다음을 수행할 수 있습니다.

- 웹 앱을 저장할 이름이 &lt;S3BucketName\>인 S3 버킷 생성
- 투표를 저장할 이름이 `VoteApp`인 DynamoDB 테이블 생성
- 투표 합계를 집계할 이름이 `VoteAppAggregates`인 DynamoDB 테이블 생성
- 애플리케이션에서 투표를 진행할 수 있게 해주는 Lambda 함수 생성
- 애플리케이션에서 투표를 집계할 수 있게 해주는 Lambda 함수 생성
- Lambda 함수가 Amazon CloudWatch Logs에 쓰고 DynamoDB 테이블에 쓰고 쿼리할 수 있게 해주는 AWS Identity and Access Management(IAM) 역할 및 정책 생성

## 동적 대시보드

AWS CloudFormation 템플릿을 통해 구성된 서비스와 리소스는 이 리포지토리에서 발견된 HTML, JavaScript 및 CSS 파일을 사용하는 HTML 페이지인 `index.html`을 사용하여 테스트할 수 있습니다. 이러한 파일을 AWS CloudFormation 스크립트로 만든 S3 버킷으로 복사할 수 있습니다.

## 지침
**중요:** 제공된 CloudFormation 템플릿은 Lambda 코드를 us-east-1 리전의 버킷에서 가져옵니다. 이 샘플을 다른 리전에서 시작하려면 템플릿을 수정하고 Lambda 코드를 해당 리전의 버킷에 업로드하십시오. 

이 예제는 전화 번호를 통해 사용자로부터 텍스트 메시지로 투표 결과를 수신하는 방법을 보여줍니다. 이 아키텍처로 만든 시스템을 복제하려면 [Twilio](http://twilio.com) 같은 타사의 전화 번호를 설정해야 합니다. 전체 세부 정보는 [AWS Startup Collection at Medium](https://medium.com/aws-activate-startup-blog)의 [게시물](https://medium.com/aws-activate-startup-blog/building-dynamic-dashboards-using-aws-lambda-and-amazon-dynamodb-streams-part-ii-b2d883bebde5) 에서 확인할 수 있습니다.

1단계 – 스택에 대해 소문자 이름을 지정하여 [template](https://s3.amazonaws.com/awslambda-reference-architectures/web-app/lambda_webapp.template)을 통해 AWS CloudFormation 스택을 만듭니다.

2단계 – AWS 계정에서 [API Gateway dashboard](https://console.aws.amazon.com/apigateway/home)로 이동하여 `/vote` 엔드포인트가 지정된 새 리소스를 만듭니다. `Integration Request` 유형이 "Lambda Function"인 POST 메서드를 할당하고 타사 투표 서비스(이 예제에서는 Twilio)로부터 투표 결과를 수신하는, AWS CloudFormation으로 만든 Lambda 함수를 가리키도록 합니다.

`Mapping Templates`에서 "Content-Type"을 `application/x-www-form-urlencoded`로 설정하고 [this mapping template](apigateway-mappingtemplate.txt)을 추가합니다.

3단계 - [Amazon Cognito dashboard](https://console.aws.amazon.com/cognito/home)로 이동하여 인증되지 않은 자격 증명에 액세스할 수 있게 해주는 새 자격 증명 풀을 만듭니다. 위의 AWS CloudFormation 스크립트로 만든 집계 DynamoDB 테이블에 대한 읽기 액세스를 허용하도록 정책 문서를 수정합니다. 이렇게 하면 인증되지 않은 사용자가 DynamoDB의 투표 집계 테이블로부터 데이터를 가져갈 수 있습니다. Amazon Cognito는 JavaScript 플랫폼에 대한 샘플 코드를 제공합니다. 자격 증명 ID 값을 확인합니다. 이 값은 4단계에서 필요합니다.

4단계 – 이 리포지토리에서 HTML, CSS 및 JS 파일을 대시보드를 저장하기 위해 만든 정적 S3 버킷으로 복사합니다. `refresh.js`를 열고 `region` 및 `identity-pool-id`의 기본값을 적절한 값으로 변경해야 합니다.

축하합니다! 이제 사용 가능한 예제 레퍼런스 아키텍처를 만들었습니다. 실시간으로 투표를 진행하고 DynamoDB 테이블을 조정하여 다양한 수준의 수신 트래픽을 처리하고 대시보드에서 실시간으로 결과 변동 상황을 확인할 수 있습니다.

## 주의 사항

AWS CloudFormation 스크립트는 두 DynamoDB 테이블을 만듭니다. AWS CloudFormation 스크립트를 통해 읽기 및 쓰기 용량을 지정할 수 있지만 이 스크립트에서 테이블 이름은 지정할 수 없습니다. 투표를 수신 및 집계하는 JavaScript 코드가 테이블의 이름((_VoteApp_ 및 _VoteAppAggregates_)을 사전에 알아야 하기 때문입니다. DynamoDB 테이블의 이름을 변경하려면 [he aggregate source](/lambda-functions/aggregate-votes/) 및 [the receiving source](/lambda-functions/receive-vote/)에서 찾을 수 있는 코드의 JavaScript 파일에서 이름을 변경합니다.

## 정리

자동으로 생성된 모든 리소스를 제거하려면 AWS CloudFormation 스택을 삭제합니다. API Gateway 엔드포인트 및 Amazon Cognito 자격 증명 풀은 직접 삭제해야 합니다.

참고: 스택을 삭제하기 전에 버킷에 있는 모든 파일을 제거하지 않으면 S3 버킷을 삭제할 수 없습니다.

## 라이선스

이 레퍼런스 아키텍처 샘플은 Apache 2.0에서 라이선스가 부여되었습니다.
